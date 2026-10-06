import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const repo = process.cwd()
const scanner = path.join(repo, 'scripts/privacy-scan.mjs')
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'qslc-privacy-'))

function runFixture(name, content) {
  const dir = path.join(tmp, name)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, 'fixture.txt'), content)
  return spawnSync(process.execPath, [scanner, dir], { cwd: repo, encoding: 'utf8' })
}

const forbidden = runFixture('forbidden', 'routing number: 123456789\napi_key = "ABCDEFGHIJKLMNOP123456"\npayroll total $1234.56')
if (forbidden.status === 0) {
  console.error('Expected forbidden fixture to fail privacy scan')
  process.exit(1)
}

const safe = runFixture('safe', 'Private banking, payroll, and credentials are excluded from the public application. Synthetic demo only.')
if (safe.status !== 0) {
  console.error(safe.stderr || safe.stdout)
  console.error('Expected explanatory fixture to pass privacy scan')
  process.exit(1)
}

console.log('Privacy scanner regression tests passed')
