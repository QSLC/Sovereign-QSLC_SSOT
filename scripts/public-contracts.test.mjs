import { readFile } from 'node:fs/promises'
import assert from 'node:assert/strict'

const catalog = await readFile(new URL('../src/public/catalog.ts', import.meta.url), 'utf8')
const app = await readFile(new URL('../src/App.tsx', import.meta.url), 'utf8')
const calculator = await readFile(new URL('../src/public/components/LivingCalculatorDemo.tsx', import.meta.url), 'utf8')

const required = [
  ["Starter", 'price:49', "cadence:'monthly'"],
  ["Pro", 'price:149', "cadence:'monthly'"],
  ["Business", 'price:499', "cadence:'monthly'"],
  ["Starter Command Center Template", 'price:49', "cadence:'one-time'"],
  ["Self-Hosted License", 'price:499', "cadence:'one-time'"],
  ["Custom Build", 'price:1200', "cadence:'starting'"],
  ["Executive Pilot", 'price:10000', "cadence:'one-time'"],
  ["Enterprise Core", 'price:120000', "cadence:'annual'"],
  ["Enterprise Scale", 'price:250000', "cadence:'annual'"],
  ["Sovereign Platform", 'price:500000', "cadence:'annual'"],
]

for (const [name, price, cadence] of required) {
  assert.ok(catalog.includes(`name:'${name}'`), `missing offer ${name}`)
  const segment = catalog.slice(catalog.indexOf(`name:'${name}'`), catalog.indexOf(`name:'${name}'`) + 260)
  assert.ok(segment.includes(price), `wrong price for ${name}`)
  assert.ok(segment.includes(cadence), `wrong cadence for ${name}`)
}

assert.match(calculator, /SYNTHETIC DEMO — NOT QSLC FINANCIAL DATA/)
assert.match(app, /Private SSOT, payroll, banking, credentials, owner evidence/)
console.log('Public product contract checks passed')
