import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import pkg from '../package.json' with { type: 'json' }
import { registerStatusTool } from './tools/status.ts'

/** Creates the MCP server with all its tools registered. */
export function createServer(): McpServer {
  const server = new McpServer({ name: pkg.name, version: pkg.version })
  registerStatusTool(server)
  return server
}
