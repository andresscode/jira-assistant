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

| Command         | What it does                                                     |
| --------------- | ---------------------------------------------------------------- |
| `pnpm lint`     | Checks formatting, lint rules and import order. Changes nothing. |
| `pnpm lint:fix` | Applies the fixes that are safe to make automatically.           |

Formatting and linting use [Biome](https://biomejs.dev/).

## Git hooks

[Lefthook](https://lefthook.dev/) runs these on every commit:

- **pre-commit:** runs `pnpm lint:fix` on the staged files and stages the fixes.
- **commit-msg:** checks the message with [commitlint](https://commitlint.js.org/).

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

1. Create a branch from `main`, for example `git switch -c feat/readiness-check`.
2. Commit as often as you like while you work.
3. Before opening a pull request, rebase onto the latest `main` and squash your work into one commit with a final subject and, if needed, a body.
4. Open a pull request. GitHub fills its title and description from that commit.
5. Pull requests are squash-merged: the title becomes the commit subject on `main`, and the description becomes its body. Keep the title in Conventional Commits format, and keep the description to the reason for the change, without checklists or other notes. Leave it empty if the change needs no explanation.

## Dependencies

- Add them with `pnpm add` (or `pnpm add -D` for development tools).
- Versions published less than 3 days ago aren't installed (`minimumReleaseAge` in `pnpm-workspace.yaml`).
- Dependencies can't run install scripts unless they're listed under `allowBuilds` in `pnpm-workspace.yaml`.

## Local notes

Files named `*.local.md` are ignored by git. Use them for personal notes and working context for AI agents.

## Releases

Not set up yet. This section will explain how to publish a new version.
