import { create } from 'zustand'
import { format } from 'date-fns'

export const useMindMapStore = create((set, get) => ({
  nodes: [],
  edges: [],
  tasks: {},
  
  addNote: (taskId, content) => {
    set(state => {
      const task = state.tasks[taskId]
      if (!task) return state

      const note = {
        id: Date.now(),
        content,
        createdAt: Date.now(),
        type: 'note'
      }

      // If there's no running interval, create one
      const runningInterval = task.runningInterval || {
        start: Date.now(),
        notes: []
      }

      return {
        tasks: {
          ...state.tasks,
          [taskId]: {
            ...task,
            runningInterval: {
              ...runningInterval,
              notes: [...(runningInterval.notes || []), note]
            }
          }
        }
      }
    })
  },

  startTimer: (taskId) => {
    set(state => {
      const now = Date.now()
      return {
        tasks: {
          ...state.tasks,
          [taskId]: {
            ...state.tasks[taskId],
            isRunning: true,
            startTime: now,
            runningInterval: {
              start: now,
              notes: []
            }
          }
        }
      }
    })
  },

  stopTimer: (taskId) => {
    set(state => {
      const task = state.tasks[taskId]
      if (!task?.isRunning) return state

      const now = Date.now()
      const elapsed = Math.floor((now - task.startTime) / 1000)

      return {
        tasks: {
          ...state.tasks,
          [taskId]: {
            ...task,
            isRunning: false,
            timeSpent: task.timeSpent + elapsed,
            intervals: [...(task.intervals || []), {
              ...task.runningInterval,
              end: now,
              duration: elapsed
            }],
            runningInterval: null,
            lastWorkedOn: now
          }
        }
      }
    })
  },

  updateRunningTime: (taskId) => {
    set(state => {
      const task = state.tasks[taskId]
      if (!task?.isRunning) return state

      const now = Date.now()
      const elapsed = Math.floor((now - task.startTime) / 1000)
      
      return {
        tasks: {
          ...state.tasks,
          [taskId]: {
            ...task,
            timeSpent: task.timeSpent + elapsed,
            startTime: now
          }
        }
      }
    })
  },

  adjustTime: (taskId, adjustment, note) => {
    set(state => {
      const task = state.tasks[taskId]
      if (!task) return state

      const now = Date.now()
      const newTimeSpent = Math.max(0, task.timeSpent + adjustment)
      
      // Create a new interval for the adjustment
      const adjustmentInterval = {
        start: now - Math.abs(adjustment) * 1000,
        end: now,
        duration: Math.abs(adjustment),
        notes: note ? [{ content: note, createdAt: now }] : [],
        isAdjustment: adjustment < 0
      }

      return {
        tasks: {
          ...state.tasks,
          [taskId]: {
            ...task,
            timeSpent: newTimeSpent,
            intervals: [...(task.intervals || []), adjustmentInterval],
            runningInterval: task.isRunning ? {
              ...task.runningInterval,
              start: now
            } : null,
            lastWorkedOn: now
          }
        }
      }
    })
  },

  updateTaskSize: (taskId, width, height) => {
    set(state => {
      const updatedNodes = state.nodes.map(node => 
        node.id === taskId 
          ? { ...node, data: { ...node.data, width, height } }
          : node
      )
      
      return { nodes: updatedNodes }
    })
  },

  updateNodes: (newNodes) => {
    set({ nodes: newNodes })
  },

  addNode: (newNode) => {
    set(state => ({
      nodes: [...state.nodes, newNode]
    }))
  },

  updateEdges: (edges) => {
    set({ edges })
  },

  updateTaskName: (id, name) => {
    set(state => {
      // Check for existing task with the same name
      let existingTask = Object.values(state.tasks).find(task => task.name === name && task.id !== id)
      let newName = name
      let counter = 2
      
      while (existingTask) {
        newName = `${name} (${counter})`
        counter++
        existingTask = Object.values(state.tasks).find(task => task.name === newName && task.id !== id)
      }

      const updatedTasks = {
        ...state.tasks,
        [id]: {
          ...state.tasks[id],
          name: newName
        }
      }

      const updatedNodes = state.nodes.map(node => 
        node.id === id 
          ? { ...node, data: { ...node.data, name: newName } }
          : node
      )

      return {
        tasks: updatedTasks,
        nodes: updatedNodes
      }
    })
  },

  addTask: (id, name) => {
    set(state => {
      // Check for existing task with the same name
      let existingTask = Object.values(state.tasks).find(task => task.name === name)
      let newName = name
      let counter = 2
      
      while (existingTask) {
        newName = `${name} (${counter})`
        counter++
        existingTask = Object.values(state.tasks).find(task => task.name === newName)
      }

      return {
        tasks: {
          ...state.tasks,
          [id]: {
            id,
            name: newName,
            timeSpent: 0,
            isRunning: false,
            startTime: null,
            intervals: [],
            runningInterval: null,
            createdAt: Date.now(),
            lastWorkedOn: null
          }
        }
      }
    })
  },

  exportData: () => {
    const { tasks } = get()
    const rows = [
      ['Task Name', 'Start Time', 'End Time', 'Duration', 'Notes', 'Type']
    ]

    Object.values(tasks).forEach(task => {
      task.intervals.forEach(interval => {
        rows.push([
          task.name,
          format(new Date(interval.start), 'yyyy-MM-dd HH:mm:ss'),
          interval.end ? format(new Date(interval.end), 'yyyy-MM-dd HH:mm:ss') : 'Running',
          interval.duration ? `${Math.floor(interval.duration / 3600)}:${Math.floor((interval.duration % 3600) / 60)}:${interval.duration % 60}` : '',
          interval.notes?.map(n => n.content).join(' | ') || '',
          interval.isAdjustment ? 'Adjustment' : 'Timer'
        ])
      })
    })

    const csvContent = rows.map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `mindmap_export_${format(new Date(), 'yyyyMMdd_HHmmss')}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}))
