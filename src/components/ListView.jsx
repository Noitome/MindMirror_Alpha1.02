import React, { useMemo } from 'react'
import { useMindMapStore } from '../store/mindMapStore'
import { computeRollupTimes, computeDepths } from '../lib/aggregation'

const ListView = ({ showBackendData }) => {
  const tasks = useMindMapStore(state => state.tasks)
  const nodes = useMindMapStore(state => state.nodes)
  const edges = useMindMapStore(state => state.edges)

  const taskList = useMemo(() => {
    const rolled = computeRollupTimes(tasks, edges)
    const depths = computeDepths(tasks, edges)

    const taskData = Object.values(tasks).map(task => {
      const node = nodes.find(n => n.id === task.id)
      const width = node?.data?.width || 200
      const height = node?.data?.height || 100
      const boundingBoxSize = width * height
      return {
        ...task,
        width,
        height,
        boundingBoxSize,
        timeSpent: task.timeSpent || 0,
        rolledTime: rolled[task.id] || 0,
        depth: depths[task.id] || 0
      }
    })

    const totalTime = taskData.reduce((sum, task) => sum + task.timeSpent, 0)
    const totalBoundingBoxSize = taskData.reduce((sum, task) => sum + task.boundingBoxSize, 0)

    const enriched = taskData.map(task => {
      const expectedTimeRatio = totalBoundingBoxSize ? task.boundingBoxSize / totalBoundingBoxSize : 0
      const actualTimeRatio = totalTime ? task.timeSpent / totalTime : 0
      const alignmentScore = Math.max(0, Math.min(100, Math.round(100 - (Math.abs(actualTimeRatio - expectedTimeRatio) * 100))))
      return {
        ...task,
        expectedTimeRatio,
        actualTimeRatio,
        alignmentScore,
        timeRatio: Math.min(100, Math.round(actualTimeRatio * 100))
      }
    })

    return enriched.sort((a, b) => b.rolledTime - a.rolledTime)
  }, [tasks, nodes, edges])

  const totalAlignmentScore = useMemo(() => {
    if (taskList.length === 0) return 0
    
    // Calculate overall alignment score as average of individual alignment scores
    const validTasks = taskList.filter(task => task.alignmentScore !== undefined)
    if (validTasks.length === 0) return 0
    
    const averageAlignment = validTasks.reduce((sum, task) => sum + task.alignmentScore, 0) / validTasks.length
    
    return Math.round(averageAlignment)
  }, [taskList])

  const formatDuration = (seconds) => {
    if (seconds < 60) {
      return `${seconds}s`
    } else if (seconds < 3600) {
      return `${Math.floor(seconds / 60)}m ${seconds % 60}s`
    } else if (seconds < 86400) {
      const h = Math.floor(seconds / 3600)
      const m = Math.floor((seconds % 3600) / 60)
      return `${h}h ${m}m`
    } else {
      const d = Math.floor(seconds / 86400)
      const h = Math.floor((seconds % 86400) / 3600)
      return `${d}d ${h}h`
    }
  }

  const getAlignmentColor = (score) => {
    const red = Math.round(255 * (100 - score) / 100)
    const green = Math.round(255 * score / 100)
    return `rgb(${red}, ${green}, 0)`
  }

  const relativeFontSize = Math.max(16, Math.min(32, window.innerWidth * 0.02))

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative'
    }}>
      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: '20px',
        paddingBottom: '120px'
      }}>
        <h2 style={{ marginTop: 0 }}>Priority List (Ordered by Bounding Box Size)</h2>
        
        {taskList.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
            No tasks yet. Add some tasks to the mind map to see them here.
          </div>
        ) : (
          <>
            <div style={{
              display: 'grid',
              gap: '10px',
              marginBottom: '20px'
            }}>
              {taskList.map((task, index) => (
                <div key={task.id} style={{
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #dee2e6',
                  borderRadius: '8px',
                  padding: '15px',
                  position: 'relative'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '8px'
                  }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: 0, color: '#333', paddingLeft: `${(task.depth || 0) * 16}px` }}>
                        {index + 1}. {task.name}
                      </h4>
                      <div style={{
                        fontSize: '12px',
                        color: '#666',
                        marginTop: '4px'
                      }}>
                        Size: {task.width}×{task.height} = {task.boundingBoxSize.toLocaleString()}px² | 
                        Expected: {Math.min(100, Math.round(task.expectedTimeRatio * 100))}% | 
                        Actual: {task.timeRatio}%
                      </div>
                    </div>
                    <div style={{
                      textAlign: 'right',
                      fontSize: '14px'
                    }}>
                      <div style={{ fontWeight: 'bold' }}>
                        {formatDuration(task.timeSpent)}
                      </div>
                      <div style={{
                        color: getAlignmentColor(task.alignmentScore),
                        fontWeight: 'bold'
                      }}>
                        {task.alignmentScore}% aligned
                      </div>
                    </div>
                  </div>
                  
                  <div style={{
                    height: '4px',
                    backgroundColor: '#e9ecef',
                    borderRadius: '2px',
                    overflow: 'hidden',
                    marginTop: '8px'
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${Math.min(100, task.alignmentScore)}%`,
                      backgroundColor: getAlignmentColor(task.alignmentScore),
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      
      {/* Total Alignment Score */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        right: '20px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        border: '2px solid #333',
        borderRadius: '8px',
        padding: '15px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        zIndex: 10
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{
              fontSize: `${relativeFontSize}px`,
              fontWeight: 'bold',
              color: getAlignmentColor(totalAlignmentScore),
              lineHeight: 1
            }}>
              {totalAlignmentScore}%
            </div>
            <div style={{
              fontSize: `${relativeFontSize * 0.6}px`,
              color: '#666',
              marginTop: '2px'
            }}>
              Overall Alignment
            </div>
          </div>
          
          <div style={{
            fontSize: '12px',
            color: '#666',
            textAlign: 'right'
          }}>
            <div>Time vs Expected Distribution</div>
            <div>Based on Box Sizes</div>
          </div>
        </div>
        
        <div style={{
          height: '8px',
          backgroundColor: '#e9ecef',
          borderRadius: '4px',
          overflow: 'hidden',
          marginTop: '10px'
        }}>
          <div style={{
            height: '100%',
            width: `${Math.min(100, totalAlignmentScore)}%`,
            backgroundColor: getAlignmentColor(totalAlignmentScore),
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>
    </div>
  )
}

export default ListView
