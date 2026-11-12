// Puts together what the release workflow publishes to the `release` branch:
// the marketplace catalog and the built plugin. `pnpm build:release` builds,
// then runs this.
//
// Usage: node scripts/build-release.ts [output folder, default: release]
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import pkg from '../package.json' with { type: 'json' }

const rootDir = join(import.meta.dirname, '..')
const pluginDir = join(rootDir, 'plugin')
const outDir = resolve(process.argv[2] ?? join(rootDir, 'release'))

if (!existsSync(join(pluginDir, 'dist', 'server.mjs'))) {
  console.error('The plugin is not built. Run `pnpm build` first.')
  process.exit(1)
}

rmSync(outDir, { recursive: true, force: true })
cpSync(pluginDir, join(outDir, 'plugin'), { recursive: true })

// Claude Code and Copilot CLI both read this catalog. The plugin's version
// comes from its own plugin.json, so it isn't repeated here.
const catalog = {
  name: pkg.name,
  owner: { name: pkg.author },
  description: pkg.description,
  plugins: [
    {
      name: pkg.name,
      source: './plugin',
      description: pkg.description,
    },
  ],
}
mkdirSync(join(outDir, '.claude-plugin'))
writeFileSync(
  join(outDir, '.claude-plugin', 'marketplace.json'),
  `${JSON.stringify(catalog, null, 2)}\n`,
)

console.log(`Release ${pkg.version} written to ${outDir}`)
