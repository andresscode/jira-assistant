import assert from 'node:assert/strict'
import { describe, it, type TestContext } from 'node:test'
import { fileURLToPath } from 'node:url'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import {
  getDefaultEnvironment,
  StdioClientTransport,
} from '@modelcontextprotocol/sdk/client/stdio.js'
import pkg from '../../package.json' with { type: 'json' }

// End-to-end tests: start the built bundle the way an AI tool does and talk to it over MCP.
const serverPath = fileURLToPath(
  new URL('../../plugin/dist/server.mjs', import.meta.url),
)

// Only the basic environment plus `env` is passed, so Jira settings in the
// developer's shell never leak into the tests.
async function connect(
  t: TestContext,
  env: Record<string, string> = {},
): Promise<Client> {
  const client = new Client({ name: 'e2e-test', version: '0.0.0' })
  await client.connect(
    new StdioClientTransport({
      command: process.execPath,
      args: [serverPath],
      env: { ...getDefaultEnvironment(), ...env },
    }),
  )
  t.after(() => client.close())
  return client
}

const timeout = 10_000

describe('built server', () => {
  it('starts and reports its name and version', { timeout }, async (t) => {
    const client = await connect(t)

    const server = client.getServerVersion()
    assert.equal(server?.name, pkg.name)
    assert.equal(server?.version, pkg.version)
  })

  it('lists a read-only status tool', { timeout }, async (t) => {
    const client = await connect(t)

    const { tools } = await client.listTools()
    const status = tools.find((tool) => tool.name === 'status')
    assert.ok(status, 'status tool is listed')
    assert.equal(status.annotations?.readOnlyHint, true)
  })
})

describe('status tool', () => {
  const runningLine = `Jira Assistant ${pkg.version} is running (Node.js ${process.versions.node}).`

  async function statusText(t: TestContext, env?: Record<string, string>) {
    const client = await connect(t, env)
    const result = await client.callTool({ name: 'status' })
    const [content] = result.content as { type: string; text: string }[]
    return content?.text
  }

  it('reports missing Jira settings without failing', {
    timeout,
  }, async (t) => {
    assert.equal(
      await statusText(t),
      `${runningLine}\nJira: not set up. JA_JIRA_URL is not set. JA_JIRA_EMAIL is not set. JA_JIRA_API_TOKEN is not set.`,
    )
  })

  it('reports invalid Jira settings without failing', {
    timeout,
  }, async (t) => {
    const text = await statusText(t, {
      JA_JIRA_URL: 'http://example.atlassian.net',
      JA_JIRA_EMAIL: 'user@example.com',
      JA_JIRA_API_TOKEN: 'secret-token',
    })
    assert.equal(
      text,
      `${runningLine}\nJira: not set up. JA_JIRA_URL must start with https://.`,
    )
  })

  it('reports a Jira site that cannot be reached', { timeout }, async (t) => {
    // Nothing listens on port 9 of this machine, so the connection is refused at once.
    const text = await statusText(t, {
      JA_JIRA_URL: 'https://127.0.0.1:9',
      JA_JIRA_EMAIL: 'user@example.com',
      JA_JIRA_API_TOKEN: 'secret-token',
    })
    assert.equal(
      text,
      `${runningLine}\nJira: connection failed. Couldn't reach Jira at https://127.0.0.1:9. Check JA_JIRA_URL and your network connection.`,
    )
  })
})
