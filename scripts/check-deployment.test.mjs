import assert from 'node:assert/strict'
import { checkDeployment } from './check-deployment.mjs'

function fake(routes){
  return async url => {
    const item = routes[url]
    if (item instanceof Error) throw item
    if (!item) return new Response('missing',{status:404})
    return new Response(item.body ?? '',{status:item.status,headers:item.location?{location:item.location}:{}})
  }
}

let result = await checkDeployment('https://a.example/start','b.example',{fetchImpl:fake({
  'https://a.example/start':{status:302,location:'https://b.example/final'},
  'https://b.example/final':{status:200,body:'ok'},
})})
assert.equal(result.healthy,true)

result = await checkDeployment('https://loop.example/a','loop.example',{fetchImpl:fake({
  'https://loop.example/a':{status:302,location:'/b'},
  'https://loop.example/b':{status:302,location:'/a'},
})})
assert.equal(result.reason,'redirect_loop')

result = await checkDeployment('https://x.example/','x.example',{fetchImpl:fake({'https://x.example/':{status:403}})})
assert.equal(result.reason,'forbidden')

result = await checkDeployment('https://x.example/','expected.example',{fetchImpl:fake({'https://x.example/':{status:200}})})
assert.equal(result.reason,'unexpected_final_host')

result = await checkDeployment('https://x.example/','x.example',{fetchImpl:fake({'https://x.example/':new Error('network down')})})
assert.equal(result.reason,'request_failure')

console.log('Deployment health regression checks passed')
