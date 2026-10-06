import assert from 'node:assert/strict'
import { validatePublicContract } from './validate-public-contract.mjs'

assert.equal(validatePublicContract({generatedAt:null,sourceStatus:'demo',freshness:'synthetic',synthetic:true,metrics:[{id:'safe',label:'Safe metric',value:1}]}),true)
assert.throws(()=>validatePublicContract({generatedAt:null,sourceStatus:'demo',freshness:'synthetic',synthetic:true,metrics:[{id:'bad',label:'Bad',value:1,payroll:{gross:9000}}]}),/Forbidden|Unexpected/)
assert.throws(()=>validatePublicContract({generatedAt:null,sourceStatus:'demo',freshness:'synthetic',synthetic:true,metrics:[],bankAccount:'123'}),/Forbidden/)
console.log('Public contract validator regression checks passed')
