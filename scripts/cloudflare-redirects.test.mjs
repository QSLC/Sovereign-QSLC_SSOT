import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const config = JSON.parse(await readFile(new URL('../infra/cloudflare/single-redirects.json', import.meta.url), 'utf8'))
assert.equal(config.schema, 'qslc.cloudflare.single-redirects.v1')
assert.equal(config.zone, 'qslc-hei.com')
assert.equal(config.phase, 'http_request_dynamic_redirect')
assert.equal(config.rules.length, 1)

const [rule] = config.rules
assert.equal(rule.ref, 'qslc_www_to_apex_2026_11')
assert.equal(rule.expression, 'http.host eq "www.qslc-hei.com"')
assert.equal(rule.action, 'redirect')
assert.equal(rule.enabled, true)
assert.equal(rule.action_parameters.from_value.status_code, 301)
assert.equal(rule.action_parameters.from_value.preserve_query_string, true)
assert.equal(
  rule.action_parameters.from_value.target_url.expression,
  'concat("https://qslc-hei.com", http.request.uri.path)',
)
assert.ok(!rule.expression.includes('admin.qslc-hei.com'))
assert.ok(!rule.expression.includes('*.qslc-hei.com'))

console.log('Cloudflare www-to-apex redirect contract: PASS')
