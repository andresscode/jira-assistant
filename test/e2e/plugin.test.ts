import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import pkg from '../../package.json' with { type: 'json' }

// End-to-end tests for the plugin folder: start the server exactly as each AI
// tool's MCP config says, so CI proves both configs on every platform.
const pluginDir = fileURLToPath(new URL('../../plugin', import.meta.url))

type StdioServer = { command: string; args: string[] }

function readJson(relativePath: string): Record<string, unknown> {
  return JSON.parse(readFileSync(join(pluginDir, relativePath), 'utf8'))
}

const configs = [
  {
    tool: 'Claude Code',
    file: '.mcp.json',
    rootVariable: 'CLAUDE_PLUGIN_ROOT',
  },
  { tool: 'Copilot', file: 'mcp.json', rootVariable: 'PLUGIN_ROOT' },
]

describe('MCP configs', () => {
  for (const { tool, file, rootVariable } of configs) {
    it(`${tool} config (${file}) starts the server`, {
      timeout: 10_000,
    }, async (t) => {
      const { mcpServers } = readJson(file) as {
        mcpServers: Record<string, StdioServer>
      }
      const server = mcpServers[pkg.name]
      assert.ok(server, `${file} defines the ${pkg.name} server`)

      // Substitute the plugin root the way the AI tool does.
      const args = server.args.map((arg) =>
        arg.replaceAll(`\${${rootVariable}}`, pluginDir),
      )
      assert.ok(
        args.every((arg) => !arg.includes('${')),
        `${file} uses only \${${rootVariable}}`,
      )

      const client = new Client({ name: 'e2e-test', version: '0.0.0' })
      await client.connect(
        new StdioClientTransport({ command: server.command, args }),
      )
      t.after(() => client.close())

      const result = await client.callTool({ name: 'status' })
      assert.deepEqual(result.content, [
        {
          type: 'text',
          text: `Jira Assistant ${pkg.version} is running (Node.js ${process.versions.node}).`,
        },
      ])
    })
  }
})

describe('manifests', () => {
  it('match package.json', () => {
    for (const file of [join('.claude-plugin', 'plugin.json'), 'plugin.json']) {
      const manifest = readJson(file)
      assert.equal(manifest.name, pkg.name, `${file} name`)
      assert.equal(manifest.version, pkg.version, `${file} version`)
    }
  })

  it('Copilot manifest uses the same schema version as mcp.json', () => {
    // Copilot disables the MCP server when these differ.
    const schemaVersion = (file: string) =>
      String(readJson(file).$schema).match(/schemas\/([^/]+)\//)?.[1]

    assert.ok(schemaVersion('plugin.json'), 'plugin.json has a $schema')
    assert.equal(schemaVersion('mcp.json'), schemaVersion('plugin.json'))
  })
})
