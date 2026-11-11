import assert from 'node:assert/strict'
import { type TestContext, test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import pkg from '../../package.json' with { type: 'json' }

// End-to-end tests: start the built bundle the way an AI tool does and talk to it over MCP.
const serverPath = fileURLToPath(
  new URL('../../plugin/dist/server.mjs', import.meta.url),
)

async function connect(t: TestContext): Promise<Client> {
  const client = new Client({ name: 'e2e-test', version: '0.0.0' })
  await client.connect(
    new StdioClientTransport({
      command: process.execPath,
      args: [serverPath],
    }),
  )
  t.after(() => client.close())
  return client
}

test('built server starts and reports its name and version', {
  timeout: 10_000,
}, async (t) => {
  const client = await connect(t)

  const server = client.getServerVersion()
  assert.equal(server?.name, pkg.name)
  assert.equal(server?.version, pkg.version)
})

test('status tool reports the running version', {
  timeout: 10_000,
}, async (t) => {
  const client = await connect(t)

  const { tools } = await client.listTools()
  const status = tools.find((tool) => tool.name === 'status')
  assert.ok(status, 'status tool is listed')
  assert.equal(status.annotations?.readOnlyHint, true)

  const result = await client.callTool({ name: 'status' })
  assert.deepEqual(result.content, [
    {
      type: 'text',
      text: `Jira Assistant ${pkg.version} is running (Node.js ${process.versions.node}).`,
    },
  ])
})
