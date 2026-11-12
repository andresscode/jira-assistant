// Writes the plugin manifests from package.json, so name, version,
// description and author are kept in one place. Run by `pnpm build`.
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import pkg from '../package.json' with { type: 'json' }

const pluginDir = join(import.meta.dirname, '..', 'plugin')

const manifest = {
  name: pkg.name,
  version: pkg.version,
  description: pkg.description,
  author: { name: pkg.author },
}

function write(relativePath: string, content: object): void {
  const path = join(pluginDir, relativePath)
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, `${JSON.stringify(content, null, 2)}\n`)
}

// Claude Code
write(join('.claude-plugin', 'plugin.json'), manifest)

// GitHub Copilot (Agent Plugins 1.0). Its $schema version must match the
// one in plugin/mcp.json, or Copilot disables the MCP server.
write('plugin.json', {
  $schema: 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json',
  ...manifest,
})
