import React from 'react';
import { createEditor } from './editor';

export default function App() {
  const editorRef = React.useRef(null);
  const containerRef = React.useRef(null);
  const [logs, setLogs] = React.useState([]);

  React.useEffect(() => {
    if (containerRef.current) {
      // Clear previous editor
      if (editorRef.current) {
        editorRef.current.destroy();
      }

      // Create a new editor instance
      const editor = createEditor(containerRef.current, (log) => {
        setLogs(prev => [...prev, log]);
      });
      editorRef.current = editor;
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
      }
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <h2 style={{ margin: '10px', textAlign: 'center' }}>Control Flow Processing Example</h2>
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div ref={containerRef} style={{ flex: 2, height: '100%' }} />
        <div style={{ 
          flex: 1, 
          padding: '10px', 
          overflow: 'auto', 
          borderLeft: '1px solid #ccc',
          maxHeight: 'calc(100vh - 100px)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <h3 style={{ margin: '0' }}>Execution Logs</h3>
            <button onClick={() => setLogs([])}>Clear</button>
          </div>
          <div style={{ overflow: 'auto', flex: 1 }}>
            {logs.map((log, i) => (
              <div key={i} style={{ 
                padding: '8px', 
                margin: '4px 0', 
                backgroundColor: '#f5f5f5', 
                borderRadius: '4px',
                fontSize: '14px'
              }}>
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}