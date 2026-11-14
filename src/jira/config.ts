/** Connection settings for a Jira Cloud site. */
export interface JiraCloudConfig {
  kind: 'cloud'
  /** Site address without a trailing slash, such as `https://example.atlassian.net`. */
  baseUrl: string
  email: string
  apiToken: string
}

/** Connection settings for Jira. Data Center will be added as a second kind. */
export type JiraConfig = JiraCloudConfig

export type JiraConfigResult =
  | { ok: true; config: JiraConfig }
  | { ok: false; problems: string[] }

/**
 * Reads the Jira settings from environment variables. Temporary: the setup page
 * replaces them before the plugin is shown to users.
 *
 * Reports every problem at once, so the user can fix them in one go. Messages
 * never include the values themselves, so the token can't leak.
 */
export function readJiraConfig(
  env: Record<string, string | undefined>,
): JiraConfigResult {
  const problems: string[] = []
  const url = read(env, 'JA_JIRA_URL', problems)
  const email = read(env, 'JA_JIRA_EMAIL', problems)
  const apiToken = read(env, 'JA_JIRA_API_TOKEN', problems)

  const baseUrl = url === undefined ? undefined : parseBaseUrl(url, problems)

  if (
    baseUrl === undefined ||
    email === undefined ||
    apiToken === undefined ||
    problems.length > 0
  ) {
    return { ok: false, problems }
  }
  return { ok: true, config: { kind: 'cloud', baseUrl, email, apiToken } }
}

function read(
  env: Record<string, string | undefined>,
  name: string,
  problems: string[],
): string | undefined {
  const value = env[name]?.trim()
  if (!value) {
    problems.push(`${name} is not set.`)
    return undefined
  }
  return value
}

function parseBaseUrl(value: string, problems: string[]): string | undefined {
  let url: URL
  try {
    url = new URL(value)
  } catch {
    problems.push(
      'JA_JIRA_URL is not a valid address. Use the site address, such as https://example.atlassian.net.',
    )
    return undefined
  }
  if (url.protocol !== 'https:') {
    problems.push('JA_JIRA_URL must start with https://.')
    return undefined
  }
  if (url.search || url.hash) {
    problems.push(
      'JA_JIRA_URL must be the site address only, such as https://example.atlassian.net.',
    )
    return undefined
  }
  return url.href.replace(/\/+$/, '')
}
