import { computeRollupTimes } from './aggregation'

export function rankByRolledTime(tasks, edges) {
  const rolled = computeRollupTimes(tasks, edges)
  return Object.values(tasks || {})
    .map(t => ({ id: t.id, rolledTime: rolled[t.id] || 0 }))
    .sort((a, b) => b.rolledTime - a.rolledTime)
    .map(x => x.id)
}
