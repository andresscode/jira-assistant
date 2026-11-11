import assert from 'node:assert/strict'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import pkg from '../../package.json' with { type: 'json' }

// Smoke test: start the built bundle the way an AI tool does and talk to it over MCP.
const serverPath = fileURLToPath(
  new URL('../../plugin/dist/server.mjs', import.meta.url),
)

test('built server starts and reports its name and version', {
  timeout: 10_000,
}, async (t) => {
  const client = new Client({ name: 'smoke-test', version: '0.0.0' })
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [serverPath],
  })
  await client.connect(transport)
  t.after(() => client.close())

  const server = client.getServerVersion()
  assert.equal(server?.name, pkg.name)
  assert.equal(server?.version, pkg.version)
})
