/** Who the configured credentials belong to, as reported by Jira. */
export interface ConnectionInfo {
  displayName: string
}

/**
 * Talks to one Jira site. Cloud is implemented first and Data Center comes
 * later; tools depend only on this interface. Methods are added when a tool
 * needs them.
 */
export interface JiraClient {
  /** Logs in and returns the user, or throws a `JiraError`. */
  testConnection(): Promise<ConnectionInfo>
}

export type JiraErrorKind =
  | 'auth'
  | 'forbidden'
  | 'not_found'
  | 'unreachable'
  | 'timeout'
  | 'unexpected'

/** A Jira failure with a message written for the user, never containing credentials. */
export class JiraError extends Error {
  readonly kind: JiraErrorKind

  constructor(kind: JiraErrorKind, message: string) {
    super(message)
    this.name = 'JiraError'
    this.kind = kind
  }
}
