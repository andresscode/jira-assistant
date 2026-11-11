import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import pkg from '../package.json' with { type: 'json' }

/** Creates the MCP server. Tools are registered here as they are added. */
export function createServer(): McpServer {
  return new McpServer({ name: pkg.name, version: pkg.version })
}
