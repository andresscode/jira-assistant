import { type ConnectionInfo, type JiraClient, JiraError } from './client.ts'
import type { JiraCloudConfig } from './config.ts'

export interface JiraCloudClientOptions {
  /** Replaced in tests, so they never reach the network. */
  fetch?: typeof fetch
  timeoutMs?: number
}

/** Jira Cloud through REST API v3, logging in with an email and API token. */
export class JiraCloudClient implements JiraClient {
  readonly #config: JiraCloudConfig
  readonly #fetch: typeof fetch
  readonly #timeoutMs: number

  constructor(config: JiraCloudConfig, options: JiraCloudClientOptions = {}) {
    this.#config = config
    this.#fetch = options.fetch ?? fetch
    this.#timeoutMs = options.timeoutMs ?? 15_000
  }

  async testConnection(): Promise<ConnectionInfo> {
    const body = await this.#get('/rest/api/3/myself')
    if (!isRecord(body) || typeof body.displayName !== 'string') {
      throw notJira(this.#config.baseUrl)
    }
    return { displayName: body.displayName }
  }

  async #get(path: string): Promise<unknown> {
    const { baseUrl, email, apiToken } = this.#config
    let response: Response
    try {
      response = await this.#fetch(`${baseUrl}${path}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Basic ${Buffer.from(`${email}:${apiToken}`).toString('base64')}`,
        },
        signal: AbortSignal.timeout(this.#timeoutMs),
      })
    } catch (error) {
      if (error instanceof DOMException && error.name === 'TimeoutError') {
        throw new JiraError(
          'timeout',
          `Jira at ${baseUrl} didn't answer within ${this.#timeoutMs / 1000} seconds.`,
        )
      }
      throw new JiraError(
        'unreachable',
        `Couldn't reach Jira at ${baseUrl}. Check JA_JIRA_URL and your network connection.`,
      )
    }

    if (response.status === 401) {
      throw new JiraError(
        'auth',
        'Jira rejected the login. Check JA_JIRA_EMAIL and JA_JIRA_API_TOKEN.',
      )
    }
    if (response.status === 403) {
      throw new JiraError(
        'forbidden',
        "Jira accepted the login but doesn't allow this request for that user.",
      )
    }
    if (response.status === 404) {
      throw new JiraError(
        'not_found',
        `Jira wasn't found at ${baseUrl}. Check JA_JIRA_URL.`,
      )
    }
    if (!response.ok) {
      throw new JiraError(
        'unexpected',
        `Jira at ${baseUrl} answered with an unexpected error (HTTP ${response.status}).`,
      )
    }

    try {
      return await response.json()
    } catch {
      throw notJira(baseUrl)
    }
  }
}

function notJira(baseUrl: string): JiraError {
  return new JiraError(
    'unexpected',
    `The site at ${baseUrl} didn't answer like Jira. Check JA_JIRA_URL.`,
  )
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}
