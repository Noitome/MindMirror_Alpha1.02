import React, { useEffect } from 'react'
import { useMindMapStore } from '../store/mindMapStore'

const Timer = ({ taskId, width, height }) => {
  const task = useMindMapStore(state => state.tasks[taskId])
  const updateRunningTime = useMindMapStore(state => state.updateRunningTime)
  const startTimer = useMindMapStore(state => state.startTimer)
  const stopTimer = useMindMapStore(state => state.stopTimer)
  const addNote = useMindMapStore(state => state.addNote)

  useEffect(() => {
    let interval
    if (task?.isRunning) {
      interval = setInterval(() => {
        updateRunningTime(taskId)
      }, 1000) // Update every 1 second for real human time
    }
    return () => clearInterval(interval)
  }, [task?.isRunning, taskId, updateRunningTime])

  if (!task) return null

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const handleStartTimer = () => {
    const now = Date.now()
    const lastWorkedOn = task.lastWorkedOn
    
    if (!lastWorkedOn) {
      addNote(taskId, `Goal initiated at ${new Date(now).toLocaleString()}`)
    } else {
      const timeSinceLastWork = Math.floor((now - lastWorkedOn) / 1000)
      const days = Math.floor(timeSinceLastWork / 86400)
      const hours = Math.floor((timeSinceLastWork % 86400) / 3600)
      const minutes = Math.floor((timeSinceLastWork % 3600) / 60)
      
      let timeString = ''
      if (days > 0) timeString += `${days}d `
      if (hours > 0) timeString += `${hours}h `
      if (minutes > 0) timeString += `${minutes}m`
      
      addNote(taskId, `Timer started at ${new Date(now).toLocaleString()} (last worked on ${timeString} ago)`)
    }
    
    startTimer(taskId)
  }

  // Calculate dynamic sizes based on bounding box
  const containerWidth = width || 200
  const containerHeight = height || 150
  
  const baseSize = Math.min(containerWidth, containerHeight)
  const fontSize = Math.max(8, baseSize * 0.08)
  const buttonFontSize = Math.max(6, baseSize * 0.06)
  const buttonPadding = Math.max(2, baseSize * 0.02)
  const gapSize = Math.max(4, baseSize * 0.04)

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: `${gapSize}px`,
      fontFamily: 'monospace',
      width: '100%',
      height: '100%',
      flexWrap: 'wrap',
      padding: '5%'
    }}>
      <span style={{
        fontSize: `${fontSize}px`,
        whiteSpace: 'nowrap',
        flexShrink: 1,
        lineHeight: 1
      }}>
        {formatTime(task.timeSpent)}
      </span>
      <button
        onClick={() => {
          if (task.isRunning) {
            stopTimer(taskId)
          } else {
            handleStartTimer()
          }
        }}
        style={{
          padding: `${buttonPadding}px ${buttonPadding * 2}px`,
          border: '1px solid #ccc',
          borderRadius: `${Math.max(2, baseSize * 0.01)}px`,
          backgroundColor: task.isRunning ? '#dc3545' : '#28a745',
          color: 'white',
          cursor: 'pointer',
          fontSize: `${buttonFontSize}px`,
          whiteSpace: 'nowrap',
          flexShrink: 1,
          minWidth: 'min-content',
          lineHeight: 1
        }}
      >
        {task.isRunning ? '⏸' : '▶'}
      </button>
    </div>
  )
}

export default Timer
