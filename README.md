# Jira Assistant

[![CI](https://github.com/andresscode/jira-assistant/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/andresscode/jira-assistant/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/tag/andresscode/jira-assistant?label=release)](https://github.com/andresscode/jira-assistant/tags)
![Status: early development](https://img.shields.io/badge/status-early%20development-orange)
![Node >=24](https://img.shields.io/badge/node-%3E%3D24-339933?logo=node.js&logoColor=white)

A plugin for AI assistants that checks Jira tickets against your team's Definition of Ready and helps refine them.

## What it will do

- **Check a ticket:** compare it with your team's Definition of Ready and show which criteria are met, missing or unclear.
- **Fill the gaps:** ask for missing information a few questions at a time, and remember your progress between sessions.
- **Rewrite the ticket:** update its title and description using your team's template, only after you review and confirm the change.

## Supported apps

- Claude Code
- GitHub Copilot CLI
- GitHub Copilot app
- IntelliJ IDEA, with the GitHub Copilot plugin

Plugin support is recent in all of these apps. Update to the latest version before installing.

## Requirements

Node.js 24 or newer, installed so that every app can find it. Use the installer from [nodejs.org](https://nodejs.org/) or a package manager such as `winget` or Homebrew. If you installed Node.js with a version manager such as fnm or nvm, desktop apps may not find it (see [Troubleshooting](#troubleshooting)).

## Installation

Jira Assistant is installed from its marketplace, the `release` branch of this repository. For the command-line apps, run the commands in a terminal. Inside a session, the same commands work as `/plugin ...`.

### Claude Code

```sh
claude plugin marketplace add andresscode/jira-assistant#release
claude plugin install jira-assistant@jira-assistant
```

More in Claude Code's guide to [installing plugins](https://code.claude.com/docs/en/plugins/install).

### GitHub Copilot CLI

```sh
copilot plugin marketplace add andresscode/jira-assistant#release
copilot plugin install jira-assistant@jira-assistant
```

More in GitHub's guide to [finding and installing plugins](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/plugins-finding-installing).

### GitHub Copilot app

1. Open **Customize**.
2. Click **+ Add**, choose **Manage marketplaces**, and add the marketplace `andresscode/jira-assistant#release`.
3. Click **+ Add** again, choose **Plugin**, enter `jira-assistant@jira-assistant` and click **Install**.

More in GitHub's guide to [customizing the GitHub Copilot app](https://docs.github.com/en/copilot/how-tos/github-copilot-app/customize-github-copilot-app#adding-plugins).

### IntelliJ IDEA

1. In **Settings**, go to **GitHub Copilot** > **Customizations** and open **Plugins**.
2. Click **+**, add the marketplace `andresscode/jira-assistant#release`, then click **Apply** and **OK**.
3. In the Copilot chat, open the customizations menu, select **Plugins**, find **jira-assistant** and install it.

### Check that it works

Ask your assistant "Is Jira Assistant working?" It should reply with the installed version.

## Troubleshooting

**`failed to spawn MCP server process: node: program not found`**

In the GitHub Copilot app, this error shows on the jira-assistant MCP server under **Customize** > **Installed**.

The app can't find Node.js. This happens when Node.js was installed with a version manager such as fnm or nvm, which only make it available in terminals. Install Node.js 24 or newer with the installer from [nodejs.org](https://nodejs.org/) (or `winget install OpenJS.NodeJS.LTS` on Windows), then restart the app.

**`Failed to update plugin` … `Plugin files may be in use by another app`**

Another app that uses Jira Assistant is still running, for example IntelliJ IDEA while you update in the GitHub Copilot app. Close the other apps, update, then reopen them.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).
