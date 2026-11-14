---
name: check-status
description: Checks whether Jira Assistant is installed and working, which version is active, and whether it can connect to Jira. Use when the user asks if Jira Assistant is installed, set up, running or working, which version they have, or whether it can reach Jira.
---

# Check status

Call the `status` tool from the Jira Assistant MCP server and tell the user what it reports: that Jira Assistant is running, its version, the Node.js version, and whether it can connect to Jira.

If the Jira connection isn't set up or failed, pass on the reason exactly as reported, since it names the setting to fix.

If the `status` tool isn't available, or calling it fails, tell the user that Jira Assistant isn't working. Suggest checking that Node.js 24 or newer is installed (`node --version`), then restarting their AI assistant.
