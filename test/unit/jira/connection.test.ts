import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { JiraCloudClient } from '../../../src/jira/cloud-client.ts'
import { createJiraConnection } from '../../../src/jira/connection.ts'

describe('createJiraConnection', () => {
  it('creates a Cloud client from complete settings', () => {
    const jira = createJiraConnection({
      JA_JIRA_URL: 'https://example.atlassian.net/',
      JA_JIRA_EMAIL: 'user@example.com',
      JA_JIRA_API_TOKEN: 'secret-token',
    })
    assert.equal(jira.configured, true)
    assert.equal(
      jira.configured && jira.baseUrl,
      'https://example.atlassian.net',
    )
    assert.ok(jira.configured && jira.client instanceof JiraCloudClient)
  })

  it('returns the problems when settings are missing', () => {
    assert.deepEqual(
      createJiraConnection({ JA_JIRA_URL: 'https://example.atlassian.net' }),
      {
        configured: false,
        problems: [
          'JA_JIRA_EMAIL is not set.',
          'JA_JIRA_API_TOKEN is not set.',
        ],
      },
    )
  })
})
