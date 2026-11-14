import assert from 'node:assert/strict'
import { describe, it, type TestContext } from 'node:test'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js'
import pkg from '../../../package.json' with { type: 'json' }
import { type JiraClient, JiraError } from '../../../src/jira/client.ts'
import type { JiraConnection } from '../../../src/jira/connection.ts'
import { createServer } from '../../../src/server.ts'

const runningLine = `Jira Assistant ${pkg.version} is running (Node.js ${process.versions.node}).`

/** Connects an MCP client to a server built with the given Jira connection. */
async function connect(t: TestContext, jira: JiraConnection): Promise<Client> {
  const server = createServer({ jira })
  const client = new Client({ name: 'unit-test', version: '0.0.0' })
  const [clientTransport, serverTransport] =
    InMemoryTransport.createLinkedPair()
  await Promise.all([
    server.connect(serverTransport),
    client.connect(clientTransport),
  ])
  t.after(() => client.close())
  return client
}

async function statusText(t: TestContext, jira: JiraConnection) {
  const client = await connect(t, jira)
  const result = await client.callTool({ name: 'status' })
  assert.equal(result.isError, undefined)
  const [content] = result.content as { type: string; text: string }[]
  assert.equal(content?.type, 'text')
  return content.text
}

function fakeClient(testConnection: JiraClient['testConnection']) {
  return {
    configured: true,
    baseUrl: 'https://example.atlassian.net',
    client: { testConnection },
  } as const
}

describe('status tool', () => {
  it('is listed as read-only', async (t) => {
    const client = await connect(t, { configured: false, problems: [] })
    const { tools } = await client.listTools()
    const status = tools.find((tool) => tool.name === 'status')
    assert.equal(status?.annotations?.readOnlyHint, true)
  })

  describe('Jira connected', () => {
    it('reports the site and the logged-in user', async (t) => {
      const text = await statusText(
        t,
        fakeClient(async () => ({ displayName: 'Ada Example' })),
      )
      assert.equal(
        text,
        `${runningLine}\nJira: connected to https://example.atlassian.net as Ada Example.`,
      )
    })
  })

  describe('Jira not set up', () => {
    it('lists every problem with the settings', async (t) => {
      const text = await statusText(t, {
        configured: false,
        problems: ['JA_JIRA_URL is not set.', 'JA_JIRA_EMAIL is not set.'],
      })
      assert.equal(
        text,
        `${runningLine}\nJira: not set up. JA_JIRA_URL is not set. JA_JIRA_EMAIL is not set.`,
      )
    })
  })

  describe('Jira connection failed', () => {
    it('shows the message of a Jira error', async (t) => {
      const text = await statusText(
        t,
        fakeClient(async () => {
          throw new JiraError('auth', 'Jira rejected the login.')
        }),
      )
      assert.equal(
        text,
        `${runningLine}\nJira: connection failed. Jira rejected the login.`,
      )
    })

    it('hides the details of an unexpected error', async (t) => {
      t.mock.method(console, 'error', () => {})
      const text = await statusText(
        t,
        fakeClient(async () => {
          throw new Error('internal detail')
        }),
      )
      assert.match(text, /connection failed with an unexpected error/)
      assert.doesNotMatch(text, /internal detail/)
    })
  })
})
