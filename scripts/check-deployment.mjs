export async function checkDeployment(startUrl, expectedHost, options = {}) {
  const maxHops = options.maxHops ?? 8
  const timeoutMs = options.timeoutMs ?? 10000
  const fetchImpl = options.fetchImpl ?? fetch
  let current = new URL(startUrl)
  const seen = new Set()
  const hops = []

  for (let hop = 0; hop <= maxHops; hop += 1) {
    if (seen.has(current.href)) return {healthy:false,reason:'redirect_loop',hops,finalUrl:current.href}
    seen.add(current.href)
    const controller = new AbortController()
    const timer = setTimeout(()=>controller.abort(),timeoutMs)
    let response
    try {
      response = await fetchImpl(current.href,{redirect:'manual',signal:controller.signal})
    } catch (error) {
      clearTimeout(timer)
      return {healthy:false,reason:'request_failure',error:String(error),hops,finalUrl:current.href}
    }
    clearTimeout(timer)
    hops.push({url:current.href,status:response.status})
    if (response.status === 403) return {healthy:false,reason:'forbidden',hops,finalUrl:current.href}
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location')
      if (!location) return {healthy:false,reason:'redirect_without_location',hops,finalUrl:current.href}
      current = new URL(location,current)
      continue
    }
    if (!response.ok) return {healthy:false,reason:`http_${response.status}`,hops,finalUrl:current.href}
    if (expectedHost && current.hostname !== expectedHost) return {healthy:false,reason:'unexpected_final_host',hops,finalUrl:current.href}
    return {healthy:true,reason:'ok',hops,finalUrl:current.href}
  }
  return {healthy:false,reason:'too_many_redirects',hops,finalUrl:current.href}
}

if (process.argv[1]?.endsWith('check-deployment.mjs') && process.argv[2]) {
  const result = await checkDeployment(process.argv[2],process.argv[3])
  console.log(JSON.stringify(result,null,2))
  if (!result.healthy) process.exitCode = 1
}
