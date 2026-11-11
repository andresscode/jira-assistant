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
- Commit messages follow Conventional Commits, checked by commitlint. Add a body only when the reason for a change isn't obvious from the subject and the code, with lines under 100 characters.
- Don't add attribution lines to commits or pull requests, such as `Co-Authored-By` or "Generated with".
- Pull requests are squash-merged: the title becomes the commit subject on `main` and the description becomes its body. Write the title in Conventional Commits format, and limit the description to the reason for the change (or leave it empty). No checklists, summaries of the diff or test notes.
- Before opening a pull request, squash the branch into one commit, so GitHub pre-fills the title and description from it. See `CONTRIBUTING.md` for the full workflow.
- Add dependencies with `pnpm add`. Versions published less than 3 days ago are rejected on purpose, and dependency install scripts are blocked unless listed under `allowBuilds` in `pnpm-workspace.yaml`.
- Files named `*.local.md` are local working notes and are ignored by git. Never commit them.
