import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const target = process.argv[2] ?? '.'
const allowlistPath = path.join(root, 'privacy-allowlist.json')
const allowlist = fs.existsSync(allowlistPath) ? JSON.parse(fs.readFileSync(allowlistPath, 'utf8')) : { paths: [], matches: [] }

const ignoredDirs = new Set(['.git', 'node_modules'])
const ignoredFiles = new Set(['package-lock.json', 'privacy-allowlist.json'])
const textExt = new Set(['.ts', '.tsx', '.js', '.mjs', '.json', '.md', '.html', '.css', '.yml', '.yaml', '.txt'])

const rules = [
  { id: 'BANK_ACCOUNT_NUMBER', re: /\b(?:account|acct|routing)\s*(?:number|#|no\.?|:)\s*\d{6,17}\b/gi },
  { id: 'ROUTING_NUMBER', re: /\b(?:routing|aba)\s*(?:number|#|no\.?|:)\s*\d{9}\b/gi },
  { id: 'SECRET_TOKEN', re: /\b(?:api[_ -]?key|secret|token|password)\s*[:=]\s*["']?[A-Za-z0-9_-]{16,}/gi },
  { id: 'CHECK_NUMBER', re: /\b(?:paycheck|check)\s*(?:number|#|no\.?|:)\s*\d{3,17}\b/gi },
  { id: 'PAYROLL_VALUE', re: /\b(?:payroll|paycheck|gross pay|net pay)\b.{0,40}\$?\d{3,}(?:,\d{3})*(?:\.\d{2})?/gi },
]

function walk(p) {
  const stat = fs.statSync(p)
  if (stat.isFile()) return ignoredFiles.has(path.basename(p)) ? [] : [p]
  const out = []
  for (const name of fs.readdirSync(p)) {
    if (ignoredDirs.has(name) || ignoredFiles.has(name)) continue
    const child = path.join(p, name)
    const childStat = fs.statSync(child)
    if (childStat.isDirectory()) out.push(...walk(child))
    else if (textExt.has(path.extname(name))) out.push(child)
  }
  return out
}

function isAllowed(file, ruleId, matched) {
  const rel = path.relative(root, file).replaceAll('\\', '/')
  if ((allowlist.paths ?? []).includes(rel)) return true
  return (allowlist.matches ?? []).some((a) => a.rule === ruleId && a.file === rel && matched.includes(a.contains))
}

export function scanPaths(paths) {
  const findings = []
  for (const item of paths) {
    const abs = path.resolve(root, item)
    if (!fs.existsSync(abs)) continue
    for (const file of walk(abs)) {
      const rel = path.relative(root, file).replaceAll('\\', '/')
      if (rel === 'scripts/privacy-scan.mjs') continue
      const text = fs.readFileSync(file, 'utf8')
      const lines = text.split(/\r?\n/)
      for (let i = 0; i < lines.length; i++) {
        for (const rule of rules) {
          rule.re.lastIndex = 0
          const match = rule.re.exec(lines[i])
          if (match && !isAllowed(file, rule.id, match[0])) {
            findings.push({ file: rel, line: i + 1, rule: rule.id, sample: match[0] })
          }
        }
      }
    }
  }
  return findings
}

const findings = scanPaths([target])
if (findings.length) {
  for (const f of findings) console.error(`${f.file}:${f.line} [${f.rule}] ${f.sample}`)
  console.error(`Privacy scan failed: ${findings.length} finding(s).`)
  process.exit(1)
}
console.log(`Privacy scan passed: ${target}`)
