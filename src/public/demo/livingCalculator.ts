import type { DemoMetrics } from '../types'

export interface DemoInputs {
  workflows: number
  operators: number
  evidenceRate: number
}

export function calculateDemoMetrics(input: DemoInputs): DemoMetrics {
  const values = [input.workflows, input.operators, input.evidenceRate]
  if (values.some((value) => !Number.isFinite(value))) throw new Error('Demo inputs must be finite numbers')
  const workflows = Math.max(1, Math.min(250, input.workflows))
  const operators = Math.max(1, Math.min(100, input.operators))
  const evidenceRate = Math.max(0, Math.min(100, input.evidenceRate))
  return {
    synthetic: true,
    automatedHours: Math.round(workflows * 1.6),
    throughput: Math.round(workflows * (1 + operators / 50)),
    evidenceCoverage: Math.round(evidenceRate),
    estimatedControlScore: Math.round((evidenceRate * 0.65) + Math.min(35, workflows / 5)),
  }
}
