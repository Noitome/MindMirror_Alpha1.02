export function buildGraph(edges) {
  const childrenByParent = new Map()
  const parentByChild = new Map()
  ;(edges || []).forEach(e => {
    if (!e || !e.source || !e.target) return
    if (!childrenByParent.has(e.source)) childrenByParent.set(e.source, new Set())
    if (!parentByChild.has(e.target)) {
      childrenByParent.get(e.source).add(e.target)
      parentByChild.set(e.target, e.source)
    }
  })
  return { childrenByParent, parentByChild }
}

export function computeDepths(tasks, edges) {
  const { parentByChild } = buildGraph(edges)
  const depths = {}
  const visit = (id) => {
    if (!tasks || !tasks[id]) return 0
    if (depths[id] != null) return depths[id]
    const parent = parentByChild.get(id)
    depths[id] = parent ? (visit(parent) + 1) : 0
    return depths[id]
  }
  Object.keys(tasks || {}).forEach(visit)
  return depths
}

export function computeRollupTimes(tasks, edges) {
  const { childrenByParent, parentByChild } = buildGraph(edges)
  const rolled = {}
  const visiting = new Set()

  const dfs = (id) => {
    if (!tasks || !tasks[id]) return 0
    if (rolled[id] != null) return rolled[id]
    if (visiting.has(id)) {
      rolled[id] = tasks[id]?.timeSpent || 0
      return rolled[id]
    }
    visiting.add(id)
    const base = tasks[id]?.timeSpent || 0
    const children = Array.from(childrenByParent.get(id) || [])
    let sumChildren = 0
    children.forEach(childId => {
      if (parentByChild.get(childId) === id) {
        sumChildren += dfs(childId)
      }
    })
    visiting.delete(id)
    rolled[id] = base + sumChildren
    return rolled[id]
  }

  Object.keys(tasks || {}).forEach(dfs)
  return rolled
}
