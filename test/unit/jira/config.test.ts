import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { readJiraConfig } from '../../../src/jira/config.ts'

const validEnv = {
  JA_JIRA_URL: 'https://example.atlassian.net',
  JA_JIRA_EMAIL: 'user@example.com',
  JA_JIRA_API_TOKEN: 'secret-token',
}

describe('readJiraConfig', () => {
  describe('valid configuration', () => {
    it('reads a complete Cloud configuration', () => {
      assert.deepEqual(readJiraConfig(validEnv), {
        ok: true,
        config: {
          kind: 'cloud',
          baseUrl: 'https://example.atlassian.net',
          email: 'user@example.com',
          apiToken: 'secret-token',
        },
      })
    })

    it('trims spaces and trailing slashes', () => {
      const result = readJiraConfig({
        JA_JIRA_URL: ' https://example.atlassian.net/ ',
        JA_JIRA_EMAIL: ' user@example.com ',
        JA_JIRA_API_TOKEN: ' secret-token\n',
      })
      assert.deepEqual(result, {
        ok: true,
        config: {
          kind: 'cloud',
          baseUrl: 'https://example.atlassian.net',
          email: 'user@example.com',
          apiToken: 'secret-token',
        },
      })
    })

    it('keeps a path in the address', () => {
      const result = readJiraConfig({
        ...validEnv,
        JA_JIRA_URL: 'https://example.com/jira/',
      })
      assert.equal(
        result.ok && result.config.baseUrl,
        'https://example.com/jira',
      )
    })

    it('ignores unprefixed variables used by other Jira tools', () => {
      const result = readJiraConfig({
        JIRA_URL: 'https://example.atlassian.net',
        JIRA_EMAIL: 'user@example.com',
        JIRA_API_TOKEN: 'secret-token',
      })
      assert.equal(result.ok, false)
    })
  })

  describe('missing variables', () => {
    it('reports every missing variable at once', () => {
      assert.deepEqual(readJiraConfig({}), {
        ok: false,
        problems: [
          'JA_JIRA_URL is not set.',
          'JA_JIRA_EMAIL is not set.',
          'JA_JIRA_API_TOKEN is not set.',
        ],
      })
    })

    it('treats empty or blank values as missing', () => {
      const result = readJiraConfig({
        ...validEnv,
        JA_JIRA_EMAIL: '',
        JA_JIRA_API_TOKEN: '  ',
      })
      assert.deepEqual(result, {
        ok: false,
        problems: [
          'JA_JIRA_EMAIL is not set.',
          'JA_JIRA_API_TOKEN is not set.',
        ],
      })
    })
  })

  describe('JA_JIRA_URL validation', () => {
    it('rejects an address that is not a URL', () => {
      const result = readJiraConfig({
        ...validEnv,
        JA_JIRA_URL: 'example.atlassian.net',
      })
      assert.deepEqual(result, {
        ok: false,
        problems: [
          'JA_JIRA_URL is not a valid address. Use the site address, such as https://example.atlassian.net.',
        ],
      })
    })

    it('rejects an address without https', () => {
      const result = readJiraConfig({
        ...validEnv,
        JA_JIRA_URL: 'http://example.atlassian.net',
      })
      assert.deepEqual(result, {
        ok: false,
        problems: ['JA_JIRA_URL must start with https://.'],
      })
    })

    it('rejects an address with a query or fragment', () => {
      for (const url of [
        'https://example.atlassian.net/?selectedIssue=ABC-123',
        'https://example.atlassian.net/#board',
      ]) {
        const result = readJiraConfig({ ...validEnv, JA_JIRA_URL: url })
        assert.deepEqual(result, {
          ok: false,
          problems: [
            'JA_JIRA_URL must be the site address only, such as https://example.atlassian.net.',
          ],
        })
      }
    })
  })

  describe('reporting', () => {
    it('reports URL and missing-variable problems together', () => {
      const result = readJiraConfig({ JA_JIRA_URL: 'not a url' })
      assert.equal(result.ok, false)
      assert.equal(!result.ok && result.problems.length, 3)
    })

    it('never includes the token in problems', () => {
      const token = 'secret-token-value'
      const result = readJiraConfig({
        JA_JIRA_URL: 'nope',
        JA_JIRA_API_TOKEN: token,
      })
      assert.equal(result.ok, false)
      assert.ok(!JSON.stringify(result).includes(token))
    })
  })
})
