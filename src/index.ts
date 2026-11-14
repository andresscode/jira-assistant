import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { createJiraConnection } from './jira/connection.ts'
import { createServer } from './server.ts'

// Entry point: the AI tool starts this program and talks to it over stdin/stdout.
// The real dependencies are created here, and only here.
const server = createServer({ jira: createJiraConnection(process.env) })
await server.connect(new StdioServerTransport())
