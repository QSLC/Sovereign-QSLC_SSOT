import {json} from '../../_lib/calculator.js'
export async function onRequestGet({env}) {
  let storageReady=false
  if(env.CALCULATOR_DB) {
    try {await env.CALCULATOR_DB.prepare('SELECT id FROM calculator_runs LIMIT 1').all();storageReady=true} catch {}
  }
  const ok=Boolean(env.ENTITLEMENTS && env.STRIPE_WEBHOOK_SECRET && storageReady)
  return json({ok,service:'eve-entitlement',kv_bound:Boolean(env.ENTITLEMENTS),webhook_secret_configured:Boolean(env.STRIPE_WEBHOOK_SECRET),calculator_storage_ready:storageReady,calculator_formula_version:'operational-1.0.0',external_ssot_sync_verified:false,cross_device_recovery_ready:false,live_purchase_activation_verified:false},ok?200:503)
}
