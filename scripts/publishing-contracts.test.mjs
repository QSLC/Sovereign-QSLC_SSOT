import assert from 'node:assert/strict'
import fs from 'node:fs'
const d=JSON.parse(fs.readFileSync('public/publishing-manifest.json','utf8'))
assert.equal(d.titles.length,6)
assert.equal(d.titles.reduce((s,b)=>s+b.chapters,0),110)
assert.equal(d.titles.reduce((s,b)=>s+b.words,0),d.total_words)
assert.equal(d.titles.reduce((s,b)=>s+b.pdf_pages,0),135)
const expected=['The Sovereign Architect','EVE WAKE 1010','The SSOT Wars','The Protocol Economy','The Operator’s Codex','Quantum Systems']
for(const [i,b] of d.titles.entries()){
 assert.equal(b.title,expected[i]);assert.equal(b.chapter_titles.length,b.chapters)
 assert.equal(b.direct_checkout,null);assert.equal(b.direct_status,'WITHHELD_PENDING_PRODUCT_REVIEW')
 assert.equal(b.asin,null);assert.notEqual(b.kdp_status,'LIVE')
 for(const p of [b.cover,b.preview])assert(fs.statSync('public'+p).size>0)
 const reader=fs.readFileSync(`public/vault/eve1010-reader-1791330705/book-${b.number}.html`,'utf8')
 assert(reader.includes(b.title));assert(reader.includes(b.cover));assert(!reader.includes('book.stripe.com/'))
 const sample=fs.readFileSync('public'+b.preview,'utf8')
 assert(sample.includes('Sample —'));assert(sample.includes('Publishing')||sample.includes('publishing'))
}
assert.equal(d.bundle.checkout,null)
const ui=fs.readFileSync('src/public/components/BooksStore.tsx','utf8')
assert(ui.includes('kdp-bookshelf'));assert(ui.includes('localStorage.setItem'));assert(ui.includes('personal_checklist_only: true'))
assert(!ui.includes('book.stripe.com/'));assert(!ui.includes('Seven public-safe volumes'))
assert(!fs.readFileSync('public/vault/eve1010-reader-1791330705/book-07.html','utf8').includes('Live Ledger Workbook'))
console.log('Six-volume publishing, source counts, covers, samples, legacy reader and checkout controls passed')
