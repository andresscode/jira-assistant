import type { JiraClient } from './client.ts'
import { JiraCloudClient } from './cloud-client.ts'
import { readJiraConfig } from './config.ts'

/** Either a ready Jira client, or the reasons it couldn't be set up. */
export type JiraConnection =
  | { configured: true; baseUrl: string; client: JiraClient }
  | { configured: false; problems: string[] }

/** Builds the Jira client from environment variables, without contacting Jira. */
export function createJiraConnection(
  env: Record<string, string | undefined>,
): JiraConnection {
  const result = readJiraConfig(env)
  if (!result.ok) {
    return { configured: false, problems: result.problems }
  }
  return {
    configured: true,
    baseUrl: result.config.baseUrl,
    client: new JiraCloudClient(result.config),
  }
}
