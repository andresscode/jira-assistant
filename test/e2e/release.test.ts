import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import pkg from '../../package.json' with { type: 'json' }

// End-to-end test for what the release workflow publishes: the marketplace
// catalog and the built plugin it points to.
const script = fileURLToPath(
  new URL('../../scripts/build-release.ts', import.meta.url),
)

function readJson(path: string): Record<string, unknown> {
  return JSON.parse(readFileSync(path, 'utf8'))
}

test('release folder holds a catalog that points at the built plugin', (t) => {
  const outDir = mkdtempSync(join(tmpdir(), 'jira-assistant-release-'))
  t.after(() => rmSync(outDir, { recursive: true, force: true }))

  execFileSync(process.execPath, [script, outDir], { stdio: 'pipe' })

  const catalog = readJson(join(outDir, '.claude-plugin', 'marketplace.json'))
  assert.equal(catalog.name, pkg.name)
  const plugins = catalog.plugins as { name: string; source: string }[]
  assert.equal(plugins.length, 1)
  assert.equal(plugins[0]?.name, pkg.name)

  const pluginDir = join(outDir, plugins[0]?.source ?? '')
  assert.ok(existsSync(join(pluginDir, 'dist', 'server.mjs')), 'server built')
  for (const file of [join('.claude-plugin', 'plugin.json'), 'plugin.json']) {
    assert.equal(readJson(join(pluginDir, file)).version, pkg.version, file)
  }
})
