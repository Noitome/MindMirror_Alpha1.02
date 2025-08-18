import React, { useState, useRef, useEffect } from 'react'
import { useMindMapStore } from '../store/mindMapStore'

const TimeAdjuster = ({ taskId }) => {
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [note, setNote] = useState('')
  const adjustTime = useMindMapStore(state => state.adjustTime)
  const addNote = useMindMapStore(state => state.addNote)
  const task = useMindMapStore(state => state.tasks[taskId])

  const intervalRef = useRef(null)
  const timeoutRef = useRef(null)
  const isPressedRef = useRef(false)

  const handleSingleIncrement = (unit, isAdd) => {
    let adjustment = 0
    
    switch (unit) {
      case 'hours':
        adjustment = isAdd ? 3600 : -3600
        break
      case 'minutes':
        adjustment = isAdd ? 60 : -60
        break
      case 'seconds':
        adjustment = isAdd ? 1 : -1
        break
    }

    if (adjustment !== 0) {
      const adjustmentNote = note || `${isAdd ? 'Added' : 'Removed'} ${Math.abs(adjustment) >= 3600 ? Math.abs(adjustment)/3600 + 'h' : Math.abs(adjustment) >= 60 ? Math.abs(adjustment)/60 + 'm' : Math.abs(adjustment) + 's'}`
      adjustTime(taskId, adjustment, adjustmentNote)
      
      const now = new Date()
      const action = isAdd ? 'added' : 'removed'
      const unitName = Math.abs(adjustment) >= 3600 ? 'hours' : Math.abs(adjustment) >= 60 ? 'minutes' : 'seconds'
      const value = Math.abs(adjustment) >= 3600 ? Math.abs(adjustment)/3600 : Math.abs(adjustment) >= 60 ? Math.abs(adjustment)/60 : Math.abs(adjustment)
      
      const autoNote = `${unitName.slice(0, -1).toUpperCase()} ${action}: ${value} ${unitName} at ${now.toLocaleString()}${note ? ` - ${note}` : ''}`
      addNote(taskId, autoNote)
    }
  }

  const handleContinuousAdjustment = (unit, isAdd) => {
    isPressedRef.current = true
    
    // Single increment immediately
    handleSingleIncrement(unit, isAdd)
    
    // Start continuous adjustment after 300ms
    timeoutRef.current = setTimeout(() => {
      if (isPressedRef.current) {
        intervalRef.current = setInterval(() => {
          handleSingleIncrement(unit, isAdd)
        }, 150) // Fast but controlled speed
      }
    }, 300)
  }

  const stopAdjustment = () => {
    isPressedRef.current = false
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  if (!task) return null

  return (
    <div style={{ padding: '10px', maxWidth: '300px' }}>
      <div style={{ marginBottom: '15px' }}>
        <h4 style={{ margin: '0 0 10px 0' }}>Adjust Time</h4>
        
        {/* Hours */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <label style={{ width: '60px' }}>Hours:</label>
          <button 
            onMouseDown={() => handleSingleIncrement('hours', false)}
            onTouchStart={() => handleSingleIncrement('hours', false)}
            style={{
              width: '30px',
              height: '30px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            -
          </button>
          <input 
            type="number" 
            value={hours} 
            onChange={(e) => setHours(Math.max(0, parseInt(e.target.value) || 0))}
            style={{ 
              width: '50px', 
              textAlign: 'center', 
              margin: '0 5px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          <button 
            onMouseDown={() => handleSingleIncrement('hours', true)}
            onTouchStart={() => handleSingleIncrement('hours', true)}
            style={{
              width: '30px',
              height: '30px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            +
          </button>
        </div>

        {/* Minutes */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <label style={{ width: '60px' }}>Minutes:</label>
          <button 
            onMouseDown={() => handleSingleIncrement('minutes', false)}
            onTouchStart={() => handleSingleIncrement('minutes', false)}
            style={{
              width: '30px',
              height: '30px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            -
          </button>
          <input 
            type="number" 
            value={minutes} 
            onChange={(e) => setMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
            style={{ 
              width: '50px', 
              textAlign: 'center', 
              margin: '0 5px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          <button 
            onMouseDown={() => handleSingleIncrement('minutes', true)}
            onTouchStart={() => handleSingleIncrement('minutes', true)}
            style={{
              width: '30px',
              height: '30px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            +
          </button>
        </div>

        {/* Seconds */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
          <label style={{ width: '60px' }}>Seconds:</label>
          <button 
            onMouseDown={() => handleSingleIncrement('seconds', false)}
            onTouchStart={() => handleSingleIncrement('seconds', false)}
            style={{
              width: '30px',
              height: '30px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            -
          </button>
          <input 
            type="number" 
            value={seconds} 
            onChange={(e) => setSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
            style={{ 
              width: '50px', 
              textAlign: 'center', 
              margin: '0 5px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          <button 
            onMouseDown={() => handleSingleIncrement('seconds', true)}
            onTouchStart={() => handleSingleIncrement('seconds', true)}
            style={{
              width: '30px',
              height: '30px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            +
          </button>
        </div>
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <label>Note (optional): </label>
        <input 
          type="text" 
          value={note} 
          onChange={(e) => setNote(e.target.value)}
          placeholder="Reason for adjustment..."
          style={{ 
            width: '100%', 
            marginTop: '5px',
            padding: '5px',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />
      </div>
      
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button 
          onMouseDown={() => handleContinuousAdjustment('hours', true)}
          onMouseUp={stopAdjustment}
          onMouseLeave={stopAdjustment}
          onTouchStart={() => handleContinuousAdjustment('hours', true)}
          onTouchEnd={stopAdjustment}
          style={{
            padding: '8px 12px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Hold + Hours
        </button>
        <button 
          onMouseDown={() => handleContinuousAdjustment('minutes', true)}
          onMouseUp={stopAdjustment}
          onMouseLeave={stopAdjustment}
          onTouchStart={() => handleContinuousAdjustment('minutes', true)}
          onTouchEnd={stopAdjustment}
          style={{
            padding: '8px 12px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Hold + Minutes
        </button>
        <button 
          onMouseDown={() => handleContinuousAdjustment('seconds', true)}
          onMouseUp={stopAdjustment}
          onMouseLeave={stopAdjustment}
          onTouchStart={() => handleContinuousAdjustment('seconds', true)}
          onTouchEnd={stopAdjustment}
          style={{
            padding: '8px 12px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Hold + Seconds
        </button>
      </div>
    </div>
  )
}

export default TimeAdjuster
