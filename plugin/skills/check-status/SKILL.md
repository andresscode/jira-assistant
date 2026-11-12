---
name: check-status
description: Checks whether Jira Assistant is installed and working, and which version is active. Use when the user asks if Jira Assistant is installed, set up, running or working, or which version they have.
---

# Check status

Call the `status` tool from the Jira Assistant MCP server and tell the user what it reports: that Jira Assistant is running, its version and the Node.js version.

If the `status` tool isn't available, or calling it fails, tell the user that Jira Assistant isn't working. Suggest checking that Node.js 24 or newer is installed (`node --version`), then restarting their AI assistant.
