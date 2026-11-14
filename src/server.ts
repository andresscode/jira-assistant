import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import pkg from '../package.json' with { type: 'json' }
import type { JiraConnection } from './jira/connection.ts'
import { registerStatusTool } from './tools/status.ts'

/** Everything the tools depend on. Tests pass fakes; `index.ts` passes the real ones. */
export interface ServerDependencies {
  jira: JiraConnection
}

/** Creates the MCP server with all its tools registered. */
export function createServer(deps: ServerDependencies): McpServer {
  const server = new McpServer({ name: pkg.name, version: pkg.version })
  registerStatusTool(server, deps)
  return server
}
