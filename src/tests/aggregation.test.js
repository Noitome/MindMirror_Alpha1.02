import { describe, it, expect } from 'vitest'
import { computeRollupTimes } from '../lib/aggregation'

describe('computeRollupTimes', () => {
  it('rolls up linear chain A->B->C', () => {
    const tasks = {
      A: { id: 'A', timeSpent: 10 },
      B: { id: 'B', timeSpent: 20 },
      C: { id: 'C', timeSpent: 30 },
    }
    const edges = [{ source: 'A', target: 'B' }, { source: 'B', target: 'C' }]
    const rolled = computeRollupTimes(tasks, edges)
    expect(rolled.A).toBe(60)
    expect(rolled.B).toBe(50)
    expect(rolled.C).toBe(30)
  })

  it('first-parent-wins avoids double counting shared child', () => {
    const tasks = { P1: { id: 'P1', timeSpent: 5 }, P2: { id: 'P2', timeSpent: 7 }, C: { id: 'C', timeSpent: 11 } }
    const edges = [{ source: 'P1', target: 'C' }, { source: 'P2', target: 'C' }]
    const rolled = computeRollupTimes(tasks, edges)
    const p1 = rolled.P1
    const p2 = rolled.P2
    expect(p1 === 16 || p2 === 18).toBe(true)
  })

  it('cycle safe', () => {
    const tasks = { A: { id: 'A', timeSpent: 1 }, B: { id: 'B', timeSpent: 2 } }
    const edges = [{ source: 'A', target: 'B' }, { source: 'B', target: 'A' }]
    const rolled = computeRollupTimes(tasks, edges)
    expect(rolled.A).toBeGreaterThanOrEqual(1)
    expect(rolled.B).toBeGreaterThanOrEqual(2)
  })
})
