import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import pkg from '../../package.json' with { type: 'json' }

/** Reports that the server is running, and which version, so users and the AI can check the install. */
export function registerStatusTool(server: McpServer): void {
  server.registerTool(
    'status',
    {
      title: 'Jira Assistant status',
      description:
        'Check that Jira Assistant is installed and running, and which version is active.',
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    () => ({
      content: [
        {
          type: 'text',
          text: `Jira Assistant ${pkg.version} is running (Node.js ${process.versions.node}).`,
        },
      ],
    }),
  )
}
