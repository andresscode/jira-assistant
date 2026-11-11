import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { createServer } from './server.ts'

// Entry point: the AI tool starts this program and talks to it over stdin/stdout.
const server = createServer()
await server.connect(new StdioServerTransport())
