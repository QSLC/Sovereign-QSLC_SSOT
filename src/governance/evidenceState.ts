export type EvidenceState = 'pending' | 'validated' | 'dual_approved' | 'executable' | 'blocked' | 'frozen'
export type EvidenceAction = 'validate' | 'dual_approve' | 'authorize' | 'block' | 'freeze' | 'reset'

export interface EvidenceEvent {
  action: EvidenceAction
  actor: string
  source: string
  evidenceRef?: string
  buildSha?: string
  reason: string
  timestamp?: string
}

export interface AcceptedTransition {
  accepted: true
  from: EvidenceState
  to: EvidenceState
  record: Required<Omit<EvidenceEvent,'buildSha'|'evidenceRef'|'timestamp'>> & Pick<EvidenceEvent,'buildSha'|'evidenceRef'> & { timestamp: string }
}

export interface RejectedTransition {
  accepted: false
  from: EvidenceState
  to: EvidenceState
  error: string
}

export type TransitionResult = AcceptedTransition | RejectedTransition

const NEXT: Record<EvidenceState, Partial<Record<EvidenceAction, EvidenceState>>> = {
  pending: { validate:'validated', block:'blocked', freeze:'frozen' },
  validated: { dual_approve:'dual_approved', block:'blocked', freeze:'frozen' },
  dual_approved: { authorize:'executable', block:'blocked', freeze:'frozen' },
  executable: { block:'blocked', freeze:'frozen', reset:'pending' },
  blocked: { reset:'pending', freeze:'frozen' },
  frozen: { reset:'pending' },
}

const REQUIRES_EVIDENCE = new Set<EvidenceAction>(['validate','dual_approve','authorize'])

export function transitionEvidence(current: EvidenceState, event: EvidenceEvent): TransitionResult {
  const target = NEXT[current][event.action]
  if (!target) return { accepted:false, from:current, to:current, error:`Transition ${current} -> ${event.action} is not allowed` }
  if (REQUIRES_EVIDENCE.has(event.action) && !event.evidenceRef?.trim()) {
    return { accepted:false, from:current, to:current, error:'Evidence reference is required' }
  }
  if (!event.actor.trim() || !event.source.trim() || !event.reason.trim()) {
    return { accepted:false, from:current, to:current, error:'Actor, source, and reason are required' }
  }
  return {
    accepted:true,
    from:current,
    to:target,
    record:{...event, timestamp:event.timestamp ?? new Date().toISOString()},
  }
}
