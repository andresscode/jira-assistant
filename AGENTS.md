# AGENTS.md

Instructions for AI coding agents working in this repository.

## Project

A plugin for AI assistants (GitHub Copilot, Claude Code) that checks Jira tickets against a team's Definition of Ready and helps refine them. Early development: only the repo tooling exists so far.

## Commands

- `pnpm install`: install dependencies and git hooks
- `pnpm lint`: check formatting, lint rules and import order with Biome (changes nothing)
- `pnpm lint:fix`: apply safe fixes

## Conventions

- Use pnpm, never npm or yarn. Node.js 24 or newer.
- Don't format by hand: Biome enforces the style (2 spaces, single quotes, no semicolons). Run `pnpm lint:fix`.
- Commit messages follow Conventional Commits, checked by commitlint.
- Add dependencies with `pnpm add`. Versions published less than 3 days ago are rejected on purpose, and dependency install scripts are blocked unless listed under `allowBuilds` in `pnpm-workspace.yaml`.
- Files named `*.local.md` are local working notes and are ignored by git. Never commit them.
