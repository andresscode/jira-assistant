# Jira Assistant

[![CI](https://github.com/andresscode/jira-assistant/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/andresscode/jira-assistant/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/tag/andresscode/jira-assistant?label=release)](https://github.com/andresscode/jira-assistant/tags)
![Status: early development](https://img.shields.io/badge/status-early%20development-orange)
![Node >=24](https://img.shields.io/badge/node-%3E%3D24-339933?logo=node.js&logoColor=white)

A plugin for AI assistants that checks Jira issues (also called tickets or work items) against your team's Definition of Ready and helps refine them.

## What it will do

- **Check an issue:** compare it with your team's Definition of Ready and show which criteria are met, missing or unclear.
- **Fill the gaps:** ask for missing information a few questions at a time, and remember your progress between sessions.
- **Rewrite the issue:** update its title and description using your team's template, only after you review and confirm the change.

## Supported apps

- Claude Code
- GitHub Copilot CLI
- GitHub Copilot app

Plugin support is recent in all of these apps. Update to the latest version before installing.

## Requirements

Node.js 24 or newer, installed so that every app can find it. Use the installer from [nodejs.org](https://nodejs.org/) or a package manager such as `winget` or Homebrew. If you installed Node.js with a version manager such as fnm or nvm, desktop apps may not find it (see [Troubleshooting](#troubleshooting)).

## Installation

Jira Assistant is installed from its marketplace, the `release` branch of this repository. For Claude Code and GitHub Copilot CLI, run the commands in a terminal.

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

### Check that it works

Ask your assistant "Is Jira Assistant working?" It should reply with the installed version.

## Updating

Turn on auto-update where your app supports it, so you get fixes as soon as they're released. If you'd rather review each release before it's installed, update manually instead.

### Claude Code

To update automatically, start a Claude Code session, run `/plugin`, open **Marketplaces**, select **jira-assistant** and choose **Enable auto-update**.

To update manually, run this in a terminal:

```sh
claude plugin update jira-assistant
```

Or, in a Claude Code session, run `/plugin`, open **Installed**, select **jira-assistant** and choose **Update now**.

More in Claude Code's guide to [keeping plugins updated](https://code.claude.com/docs/en/plugins/install#keep-plugins-updated).

### GitHub Copilot CLI

To update automatically at the start of each Copilot CLI session, open `settings.json` in the `.copilot` folder of your home directory. Under `extraKnownMarketplaces`, find the `jira-assistant` entry and add `"autoUpdate": true`, next to its `source`. Leave `source` as it is:

```jsonc
{
  "extraKnownMarketplaces": {
    "jira-assistant": {
      "source": { ... },
      "autoUpdate": true
    }
  }
}
```

To update manually, run this in a terminal:

```sh
copilot plugin update jira-assistant
```

Or, in a Copilot CLI session, run `/plugin update jira-assistant`.

More in GitHub's [plugin reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference#copilot-plugin-update-options).

### GitHub Copilot app

The app doesn't update plugins automatically. Open **Customize** > **Installed**, click **jira-assistant** under **Plugins**, then click **Update plugin**.

## Troubleshooting

**`failed to spawn MCP server process: node: program not found`**

In the GitHub Copilot app, this error shows on the jira-assistant MCP server under **Customize** > **Installed**.

The app can't find Node.js. This happens when Node.js was installed with a version manager such as fnm or nvm, which only make it available in terminals. Install Node.js 24 or newer with the installer from [nodejs.org](https://nodejs.org/) (or `winget install OpenJS.NodeJS.LTS` on Windows), then restart the app.

**`Failed to update plugin` … `Plugin files may be in use by another app`**

Another app is using the plugin files while the GitHub Copilot app tries to replace them. IntelliJ IDEA with GitHub Copilot does this: it uses the plugins installed by the GitHub Copilot app, from `~\.copilot\installed-plugins\jira-assistant\jira-assistant`. Close IntelliJ IDEA, update, then reopen it.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).
