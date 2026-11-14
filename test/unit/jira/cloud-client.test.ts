import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { JiraError } from '../../../src/jira/client.ts'
import { JiraCloudClient } from '../../../src/jira/cloud-client.ts'
import type { JiraCloudConfig } from '../../../src/jira/config.ts'

const config: JiraCloudConfig = {
  kind: 'cloud',
  baseUrl: 'https://example.atlassian.net',
  email: 'user@example.com',
  apiToken: 'secret-token',
}

interface Call {
  url: string
  init: RequestInit | undefined
}

/** A fake `fetch` that records each call and answers with `respond`. */
function fakeFetch(respond: (call: Call) => Response | Promise<Response>) {
  const calls: Call[] = []
  const fetch = async (input: string | URL | Request, init?: RequestInit) => {
    const call = { url: String(input), init }
    calls.push(call)
    return respond(call)
  }
  return { fetch: fetch as typeof globalThis.fetch, calls }
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

/** Runs `testConnection` and returns the `JiraError` it throws. */
async function failure(fetch: typeof globalThis.fetch, timeoutMs?: number) {
  const jira = new JiraCloudClient(config, {
    fetch,
    ...(timeoutMs === undefined ? {} : { timeoutMs }),
  })
  const error = await jira.testConnection().then(
    () => assert.fail('expected testConnection to throw'),
    (error: unknown) => error,
  )
  assert.ok(error instanceof JiraError)
  return error
}

describe('JiraCloudClient', () => {
  describe('testConnection', () => {
    describe('success', () => {
      it('returns the display name of the logged-in user', async () => {
        const { fetch } = fakeFetch(() =>
          json({ accountId: 'abc', displayName: 'Ada Example' }),
        )
        const jira = new JiraCloudClient(config, { fetch })
        assert.deepEqual(await jira.testConnection(), {
          displayName: 'Ada Example',
        })
      })

      it('calls the myself endpoint with Basic auth', async () => {
        const { fetch, calls } = fakeFetch(() => json({ displayName: 'Ada' }))
        await new JiraCloudClient(config, { fetch }).testConnection()

        assert.equal(calls.length, 1)
        assert.equal(
          calls[0]?.url,
          'https://example.atlassian.net/rest/api/3/myself',
        )
        const headers = new Headers(calls[0]?.init?.headers)
        assert.equal(headers.get('Accept'), 'application/json')
        assert.equal(
          headers.get('Authorization'),
          `Basic ${Buffer.from('user@example.com:secret-token').toString('base64')}`,
        )
      })

      it('keeps a path in the site address', async () => {
        const { fetch, calls } = fakeFetch(() => json({ displayName: 'Ada' }))
        await new JiraCloudClient(
          { ...config, baseUrl: 'https://example.com/jira' },
          { fetch },
        ).testConnection()
        assert.equal(
          calls[0]?.url,
          'https://example.com/jira/rest/api/3/myself',
        )
      })
    })

    describe('HTTP errors', () => {
      const cases = [
        { status: 401, kind: 'auth', mentions: 'JA_JIRA_API_TOKEN' },
        { status: 403, kind: 'forbidden', mentions: 'login' },
        { status: 404, kind: 'not_found', mentions: 'JA_JIRA_URL' },
        { status: 500, kind: 'unexpected', mentions: 'HTTP 500' },
      ]
      for (const { status, kind, mentions } of cases) {
        it(`reports ${status} as ${kind}`, async () => {
          const error = await failure(
            fakeFetch(() => json({ errorMessages: [] }, status)).fetch,
          )
          assert.equal(error.kind, kind)
          assert.match(error.message, new RegExp(mentions))
        })
      }
    })

    describe('network errors', () => {
      it('reports a site that cannot be reached', async () => {
        const error = await failure(
          fakeFetch(() => {
            throw new TypeError('fetch failed')
          }).fetch,
        )
        assert.equal(error.kind, 'unreachable')
        assert.match(error.message, /https:\/\/example\.atlassian\.net/)
      })

      it('gives up after the timeout', async () => {
        const { fetch } = fakeFetch(
          ({ init }) =>
            new Promise((_, reject) => {
              init?.signal?.addEventListener('abort', () =>
                reject(init.signal?.reason),
              )
            }),
        )
        const error = await failure(fetch, 10)
        assert.equal(error.kind, 'timeout')
      })
    })

    describe('answers that are not from Jira', () => {
      it('reports a page that is not JSON', async () => {
        const error = await failure(
          fakeFetch(() => new Response('<html>Log in</html>')).fetch,
        )
        assert.equal(error.kind, 'unexpected')
        assert.match(error.message, /JA_JIRA_URL/)
      })

      it('reports JSON without a display name', async () => {
        const error = await failure(fakeFetch(() => json({ hello: 1 })).fetch)
        assert.equal(error.kind, 'unexpected')
      })
    })

    describe('secrets', () => {
      it('never includes the token or email in error messages', async () => {
        for (const status of [401, 403, 404, 500]) {
          const error = await failure(fakeFetch(() => json({}, status)).fetch)
          assert.ok(!error.message.includes('secret-token'))
          assert.ok(!error.message.includes('user@example.com'))
        }
      })
    })
  })
})
