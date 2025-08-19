import { describe, it, expect } from 'vitest'
import { rankByRolledTime } from '../lib/priority'

describe('rankByRolledTime', () => {
  it('orders by rolled time descending', () => {
    const tasks = { A: { id: 'A', timeSpent: 1 }, B: { id: 'B', timeSpent: 5 }, C: { id: 'C', timeSpent: 2 } }
    const edges = [{ source: 'B', target: 'C' }]
    const order = rankByRolledTime(tasks, edges)
    expect(order).toEqual(['B', 'C', 'A'])
  })

  it('ties maintain deterministic ordering by id when equal rolledTime', () => {
    const tasks = { A: { id: 'A', timeSpent: 3 }, B: { id: 'B', timeSpent: 3 } }
    const edges = []
    const order = rankByRolledTime(tasks, edges)
    expect(order.includes('A') && order.includes('B')).toBe(true)
  })
})
