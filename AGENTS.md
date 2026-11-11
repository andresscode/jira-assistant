# AGENTS.md

Instructions for AI coding agents working in this repository.

## Project

A plugin for AI assistants (GitHub Copilot, Claude Code) that checks Jira tickets against a team's Definition of Ready and helps refine them. It's an MCP server written in TypeScript, bundled into one file that ships inside the plugin. Early development.

## Structure

- `src/index.ts` is the entry point, and `src/server.ts` creates the server and registers every tool.
- Each tool lives in its own file in `src/tools/`. A new tool needs: a description that tells the AI when to use it, correct annotations (`readOnlyHint` when it changes nothing), registration in `src/server.ts`, and an end-to-end test.
- `plugin/` is what ships to users. `plugin/dist/` is build output.

## Commands

- `pnpm install`: install dependencies and git hooks
- `pnpm lint`: check formatting, lint rules and import order with Biome (changes nothing)
- `pnpm lint:fix`: apply safe fixes
- `pnpm typecheck`: check types with TypeScript
- `pnpm build`: bundle the server into `plugin/dist/server.mjs`
- `pnpm test`: run all tests (unit, then end-to-end)
- `pnpm test:unit`: run the unit tests in `test/unit/` (no build needed)
- `pnpm test:e2e`: build, then run the end-to-end tests in `test/e2e/` against the bundle

When you add or change a script, update this list and the table in `CONTRIBUTING.md`.

## Conventions

- Use pnpm, never npm or yarn. Node.js 24 or newer.
- Never write to stdout in server code: it carries the MCP messages, so a stray `console.log` breaks the plugin. Log with `console.error`.
- Node runs the `.ts` files directly, so use only syntax it can strip: no `enum`, `namespace` or constructor parameter properties. Local imports end in `.ts`, and JSON imports need `with { type: 'json' }`.
- Code must work on Windows and macOS (CI runs on Linux and Windows): build paths with `node:path` and `os.homedir()`, never by hand, and keep `package.json` scripts free of Unix-only syntax (use double quotes).
- Don't format by hand: Biome enforces the style (2 spaces, single quotes, no semicolons). Run `pnpm lint:fix`.
- Commit messages follow Conventional Commits, checked by commitlint. Add a body only when the reason for a change isn't obvious from the subject and the code, with lines under 100 characters.
- Don't add attribution lines to commits or pull requests, such as `Co-Authored-By` or "Generated with".
- A pull request must contain exactly one commit (CI enforces it), which is merged with "Rebase and merge" and lands on `main` unchanged. Squash the branch into one commit before opening the pull request, and amend it (then force-push) for later changes. See `CONTRIBUTING.md` for the full workflow.
- Add or update tests with every change in behaviour, and run `pnpm test` before finishing. Tests use `node:test` and `node:assert`, with no other test libraries. Unit tests in `test/unit/` import from `src/`; end-to-end tests in `test/e2e/` use the built bundle. Use invented data only (`ABC-123`, `example.atlassian.net`).
- Add dependencies with `pnpm add`. Versions published less than 3 days ago are rejected on purpose, and dependency install scripts are blocked unless listed under `allowBuilds` in `pnpm-workspace.yaml`.
- Files named `*.local.md` are local working notes and are ignored by git. Never commit them.
