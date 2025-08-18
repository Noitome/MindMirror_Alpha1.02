import React, { memo, useMemo, useState } from 'react'
import { Handle, Position } from 'reactflow'
import { NodeResizer } from '@reactflow/node-resizer'
import '@reactflow/node-resizer/dist/style.css'
import Timer from './Timer'
import Notes from './Notes'
import TimeAdjuster from './TimeAdjuster'
import { useMindMapStore } from '../store/mindMapStore'

const TaskNode = ({ id, data, selected }) => {
  const [showNotes, setShowNotes] = useState(false)
  const [showTimeAdjuster, setShowTimeAdjuster] = useState(false)
  const updateTaskName = useMindMapStore(state => state.updateTaskName)
  const task = useMindMapStore(state => state.tasks[id])

  const handleNameChange = (e) => {
    updateTaskName(id, e.target.value)
  }

  const dynamicStyles = useMemo(() => {
    const width = data.width || 200
    const height = data.height || 150

    // Calculate font sizes based on box dimensions - no limits
    const baseFontSize = Math.min(width, height) * 0.08
    const nameFontSize = baseFontSize * 1.5
    const timerFontSize = baseFontSize
    const metadataFontSize = baseFontSize * 0.6
    const inputPadding = width * 0.05

    return {
      container: {
        padding: `${inputPadding}px`,
      },
      name: {
        fontSize: `${nameFontSize}px`,
        padding: `${inputPadding / 2}px`,
      },
      timer: {
        fontSize: `${timerFontSize}px`,
      },
      metadata: {
        fontSize: `${metadataFontSize}px`,
      }
    }
  }, [data.width, data.height])

  if (!task) return null

  return (
    <div 
      className="task-node" 
      style={{ 
        width: '100%', 
        height: '100%',
        position: 'relative',
        border: '2px solid #4CAF50',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        ...dynamicStyles.container,
        backgroundColor: 'white'
      }}
    >
      <NodeResizer 
        color="#4CAF50"
        isVisible={selected}
        minWidth={50}
        minHeight={50}
        handleStyle={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          backgroundColor: '#4CAF50'
        }}
      />
      <Handle type="target" position={Position.Top} />
      <div 
        className="task-content" 
        style={{ 
          width: '100%', 
          textAlign: 'center',
        }}
      >
        <div className="task-metadata" style={{
          position: 'absolute',
          top: '5px',
          left: '5px',
          ...dynamicStyles.metadata,
          color: '#666',
          lineHeight: 1.2
        }}>
          {new Date(task.createdAt).toLocaleDateString()}
          {task.lastWorkedOn && (
            <div style={{ 
              fontSize: '0.8em',
              opacity: 0.8
            }}>
              Last: {new Date(task.lastWorkedOn).toLocaleDateString()}
            </div>
          )}
        </div>
        <input
          value={data.name || ''}
          onChange={handleNameChange}
          className="task-name"
          style={{ 
            ...dynamicStyles.name,
            width: '100%',
            textAlign: 'center',
            border: 'none',
            background: 'transparent',
            fontWeight: 'bold',
            boxSizing: 'border-box',
            lineHeight: 1.2
          }}
          onFocus={(e) => e.target.select()}
          onMouseDown={(e) => {
            if (window.getSelection().toString() !== '') {
              e.stopPropagation()
            }
          }}
        />
        <div style={{...dynamicStyles.timer, marginTop: '5px', width: '100%', height: '30%'}}>
          <Timer taskId={id} width={data.width} height={data.height} />
        </div>
        
        {/* Action buttons */}
        <div style={{
          display: 'flex',
          gap: '5px',
          justifyContent: 'center',
          marginTop: '10px',
          flexWrap: 'wrap'
        }}>
          <button 
            onClick={() => setShowNotes(!showNotes)}
            style={{
              padding: '4px 8px',
              fontSize: Math.max(8, (data.width || 200) * 0.03) + 'px',
              backgroundColor: showNotes ? '#007bff' : '#f8f9fa',
              color: showNotes ? 'white' : '#007bff',
              border: '1px solid #007bff',
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          >
            Notes
          </button>
          <button 
            onClick={() => setShowTimeAdjuster(!showTimeAdjuster)}
            style={{
              padding: '4px 8px',
              fontSize: Math.max(8, (data.width || 200) * 0.03) + 'px',
              backgroundColor: showTimeAdjuster ? '#ffc107' : '#f8f9fa',
              color: showTimeAdjuster ? 'white' : '#ffc107',
              border: '1px solid #ffc107',
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          >
            Adjust Time
          </button>
        </div>
        
        {/* Popup modals */}
        {showNotes && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }} onClick={() => setShowNotes(false)}>
            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              maxWidth: '500px',
              maxHeight: '80vh',
              overflow: 'auto',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }} onClick={e => e.stopPropagation()}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px'
              }}>
                <h3 style={{ margin: 0 }}>Notes for {data.name}</h3>
                <button 
                  onClick={() => setShowNotes(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '20px',
                    cursor: 'pointer',
                    color: '#666'
                  }}
                >
                  ×
                </button>
              </div>
              <Notes taskId={id} />
            </div>
          </div>
        )}
        
        {showTimeAdjuster && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }} onClick={() => setShowTimeAdjuster(false)}>
            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              maxWidth: '400px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }} onClick={e => e.stopPropagation()}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px'
              }}>
                <h3 style={{ margin: 0 }}>Adjust Time for {data.name}</h3>
                <button 
                  onClick={() => setShowTimeAdjuster(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '20px',
                    cursor: 'pointer',
                    color: '#666'
                  }}
                >
                  ×
                </button>
              </div>
              <TimeAdjuster taskId={id} />
            </div>
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}

export default memo(TaskNode)
