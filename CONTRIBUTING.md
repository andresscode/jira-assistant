# Contributing

## Prerequisites

- **Node.js 24 or newer.** With nvm, run `nvm use` in the repo to pick the version in `.nvmrc`.
- **pnpm**, any recent version. pnpm switches to the version pinned in `package.json` automatically.

## Setup

```sh
git clone https://github.com/andresscode/jira-assistant.git
cd jira-assistant
nvm use
pnpm install
```

`pnpm install` also installs the git hooks.

## Scripts

| Command          | What it does                                                     |
| ---------------- | ---------------------------------------------------------------- |
| `pnpm lint`      | Checks formatting, lint rules and import order. Changes nothing. |
| `pnpm lint:fix`  | Applies the fixes that are safe to make automatically.           |
| `pnpm typecheck` | Checks types with TypeScript. Changes nothing.                   |
| `pnpm build`     | Bundles the server into `plugin/dist/server.mjs`.                |

Formatting and linting use [Biome](https://biomejs.dev/).

## Git hooks

[Lefthook](https://lefthook.dev/) runs these automatically:

- **pre-commit:** runs `pnpm lint:fix` on the staged files and stages the fixes.
- **commit-msg:** checks the message with [commitlint](https://commitlint.js.org/).
- **pre-push:** runs `pnpm typecheck`.

## Commit messages

Messages follow [Conventional Commits](https://www.conventionalcommits.org/): `<type>: <description>`.

```text
feat: add ticket readiness check
fix: keep line breaks in rewritten descriptions
docs: explain the install steps
chore: update biome
```

Common types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `ci`, `build`.

Add a body only when the reason for a change isn't obvious from the subject and the code. Separate it from the subject with a blank line and keep lines under 100 characters. Mark breaking changes with a `BREAKING CHANGE:` footer.

```text
fix: keep line breaks in rewritten descriptions

Jira Data Center collapses single newlines in wiki markup, so the
converter now emits a blank line between paragraphs.
```

## Workflow

Each pull request adds exactly one commit to `main`, exactly as you wrote it.

1. Create a branch from `main`, for example `git switch -c feat/readiness-check`.
2. Commit as often as you like while you work.
3. Before opening a pull request, rebase onto the latest `main` and squash your work into one commit with its final subject and, if needed, a body.
4. Open a pull request. CI checks that it has exactly one commit and that the message follows Conventional Commits. The pull request description is free-form.
5. To change something after review, amend the commit and force-push the branch.
6. Merge with **Rebase and merge**. The commit lands on `main` unchanged, and history stays linear.

## Dependencies

- Add them with `pnpm add` (or `pnpm add -D` for development tools).
- Versions published less than 3 days ago aren't installed (`minimumReleaseAge` in `pnpm-workspace.yaml`).
- Dependencies can't run install scripts unless they're listed under `allowBuilds` in `pnpm-workspace.yaml`.

## Local notes

Files named `*.local.md` are ignored by git. Use them for personal notes and working context for AI agents.

## Releases

Not set up yet. This section will explain how to publish a new version.
