import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import pkg from '../../package.json' with { type: 'json' }
import { JiraError } from '../jira/client.ts'
import type { JiraConnection } from '../jira/connection.ts'

/**
 * Reports that the server is running, which version, and whether it can log in
 * to Jira, so users and the AI can check the install and the setup.
 */
export function registerStatusTool(
  server: McpServer,
  deps: { jira: JiraConnection },
): void {
  server.registerTool(
    'status',
    {
      title: 'Jira Assistant status',
      description:
        'Check that Jira Assistant is installed and running, which version is active, and whether it can connect to Jira.',
      annotations: { readOnlyHint: true, openWorldHint: true },
    },
    async () => ({
      content: [
        {
          type: 'text',
          text: [
            `Jira Assistant ${pkg.version} is running (Node.js ${process.versions.node}).`,
            await jiraStatus(deps.jira),
          ].join('\n'),
        },
      ],
    }),
  )
}

async function jiraStatus(jira: JiraConnection): Promise<string> {
  if (!jira.configured) {
    return `Jira: not set up. ${jira.problems.join(' ')}`
  }
  try {
    const { displayName } = await jira.client.testConnection()
    return `Jira: connected to ${jira.baseUrl} as ${displayName}.`
  } catch (error) {
    if (error instanceof JiraError) {
      return `Jira: connection failed. ${error.message}`
    }
    console.error('Unexpected error while testing the Jira connection:', error)
    return 'Jira: connection failed with an unexpected error. Details are in the Jira Assistant log.'
  }
}
