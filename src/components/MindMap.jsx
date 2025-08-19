import React, { useCallback, useEffect } from 'react'
import ReactFlow, { 
  Background,
  Controls,
  ReactFlowProvider,
  applyEdgeChanges,
  applyNodeChanges,
  useReactFlow
} from 'reactflow'
import 'reactflow/dist/style.css'
import TaskNode from './TaskNode'
import { useMindMapStore } from '../store/mindMapStore'

const nodeTypes = {
  task: TaskNode
}

const MindMapContent = () => {
  const nodes = useMindMapStore(state => state.nodes)
  const edges = useMindMapStore(state => state.edges)
  const updateNodes = useMindMapStore(state => state.updateNodes)
  const updateEdges = useMindMapStore(state => state.updateEdges)
  const updateTaskSize = useMindMapStore(state => state.updateTaskSize)
  const { getNodes } = useReactFlow()
  const rf = useReactFlow()

  const onNodesChange = useCallback(
    (changes) => {
      const updatedNodes = applyNodeChanges(changes, nodes)
      
      // Check for dimension changes
      changes.forEach(change => {
        if (change.type === 'dimensions' && change.dimensions) {
          updateTaskSize(change.id, change.dimensions.width, change.dimensions.height)
        }
      })
      
      updateNodes(updatedNodes)
    },
    [nodes, updateNodes, updateTaskSize]
  )

  const onEdgesChange = useCallback(
    (changes) => {
      const updatedEdges = applyEdgeChanges(changes, edges)
      updateEdges(updatedEdges)
    },
    [edges, updateEdges]
  )

  // Sync node dimensions with store
  useEffect(() => {
    const syncDimensions = () => {
      const currentNodes = getNodes()
      currentNodes.forEach(node => {
        if (node.width && node.height) {
          updateTaskSize(node.id, node.width, node.height)
        }
      })
    }
    
    const interval = setInterval(syncDimensions, 100)
    return () => clearInterval(interval)
  useEffect(() => {
    const doFit = () => {
      try {
        rf.fitView({ padding: 0.2, includeHiddenNodes: true })
      } catch (e) {}
    }
    doFit()
    const onResize = () => doFit()
    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onResize)
    }
  }, [rf])

  }, [getNodes, updateTaskSize])

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  )
}

const MindMap = () => {
  return (
    <ReactFlowProvider>
      <MindMapContent />
    </ReactFlowProvider>
  )
}

export default MindMap
