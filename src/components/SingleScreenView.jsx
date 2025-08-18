import React, { useState } from 'react'
import MindMap from './MindMap'
import ListView from './ListView'
import RealityView from './RealityView'

const SingleScreenView = () => {
  const [activeView, setActiveView] = useState('combined')
  const [showBackendData, setShowBackendData] = useState(false)

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* View selector */}
      <div style={{
        display: 'flex',
        gap: '10px',
        padding: '10px',
        backgroundColor: '#f8f9fa',
        borderBottom: '1px solid #dee2e6',
        alignItems: 'center'
      }}>
        <button
          onClick={() => setActiveView('combined')}
          style={{
            padding: '8px 16px',
            backgroundColor: activeView === 'combined' ? '#007bff' : '#f8f9fa',
            color: activeView === 'combined' ? 'white' : '#007bff',
            border: '1px solid #007bff',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Combined View
        </button>
        <button
          onClick={() => setActiveView('mindmap')}
          style={{
            padding: '8px 16px',
            backgroundColor: activeView === 'mindmap' ? '#007bff' : '#f8f9fa',
            color: activeView === 'mindmap' ? 'white' : '#007bff',
            border: '1px solid #007bff',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Mind Map Only
        </button>
        <button
          onClick={() => setActiveView('list')}
          style={{
            padding: '8px 16px',
            backgroundColor: activeView === 'list' ? '#007bff' : '#f8f9fa',
            color: activeView === 'list' ? 'white' : '#007bff',
            border: '1px solid #007bff',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Priority List Only
        </button>
        <button
          onClick={() => setActiveView('reality')}
          style={{
            padding: '8px 16px',
            backgroundColor: activeView === 'reality' ? '#007bff' : '#f8f9fa',
            color: activeView === 'reality' ? 'white' : '#007bff',
            border: '1px solid #007bff',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Reality Mirror Only
        </button>
        <label style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <input
            type="checkbox"
            checked={showBackendData}
            onChange={(e) => setShowBackendData(e.target.checked)}
          />
          Show Backend Data
        </label>
      </div>

      {/* Content area */}
      <div style={{
        flex: 1,
        display: 'flex',
        overflow: 'hidden'
      }}>
        {activeView === 'combined' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            width: '100%',
            height: '100%'
          }}>
            <div style={{
              borderRight: '1px solid #dee2e6',
              height: '100%',
              overflow: 'hidden'
            }}>
              <MindMap />
            </div>
            <div style={{
              borderRight: '1px solid #dee2e6',
              height: '100%',
              overflow: 'auto'
            }}>
              <ListView showBackendData={showBackendData} />
            </div>
            <div style={{
              height: '100%',
              overflow: 'auto'
            }}>
              <RealityView />
            </div>
          </div>
        )}

        {activeView === 'mindmap' && (
          <div style={{ width: '100%', height: '100%' }}>
            <MindMap />
          </div>
        )}

        {activeView === 'list' && (
          <div style={{ width: '100%', height: '100%', overflow: 'auto' }}>
            <ListView showBackendData={showBackendData} />
          </div>
        )}

        {activeView === 'reality' && (
          <div style={{ width: '100%', height: '100%', overflow: 'auto' }}>
            <RealityView />
          </div>
        )}
      </div>
    </div>
  )
}

export default SingleScreenView
