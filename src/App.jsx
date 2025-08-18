import React, { useState } from 'react'
import SingleScreenView from './components/SingleScreenView'
import { useMindMapStore } from './store/mindMapStore'
import './App.css'

function App() {
  const addNode = useMindMapStore(state => state.addNode)
  const addTask = useMindMapStore(state => state.addTask)
  const exportData = useMindMapStore(state => state.exportData)

  const addNewTask = () => {
    const id = Date.now().toString()
    const newNode = {
      id,
      type: 'task',
      position: { x: Math.random() * 400, y: Math.random() * 300 },
      data: { name: 'New Task', width: 200, height: 150 }
    }
    addNode(newNode)
    addTask(id, 'New Task')
  }

  return (
    <div className="app">
      <div className="header" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        backgroundColor: '#f8f9fa',
        borderBottom: '1px solid #dee2e6',
        height: '60px',
        boxSizing: 'border-box'
      }}>
        <div>
          <h2 style={{ margin: 0, color: '#333' }}>MindMirror</h2>
        </div>
        <div>
          <button 
            onClick={addNewTask}
            style={{
              padding: '8px 16px',
              marginRight: '10px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Add Task
          </button>
          <button 
            onClick={exportData}
            style={{
              padding: '8px 16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Export CSV
          </button>
        </div>
      </div>
      
      <SingleScreenView />
    </div>
  )
}

export default App
