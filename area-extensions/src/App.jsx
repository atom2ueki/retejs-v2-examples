import React from 'react';
import { createEditor } from './editor';

export default function App() {
  const ref = React.useRef(null);
  const [extensions, setExtensions] = React.useState({
    selectNodes: true,
    snapGrid: true,
    accumulateSelection: true,
    showGrid: true,
    minimap: true
  });

  React.useEffect(() => {
    if (ref.current) {
      // Clear any previous editor instance
      ref.current.innerHTML = '';
      createEditor(ref.current, extensions);
    }
  }, [extensions]);

  const toggleExtension = (name) => {
    setExtensions(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  return (
    <div>
      <div style={{ padding: '10px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <div style={{ marginRight: '20px' }}>
          <h3 style={{ margin: '0 0 5px 0' }}>Area Extensions:</h3>
        </div>
        {Object.entries(extensions).map(([key, value]) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <input 
              type="checkbox" 
              id={key} 
              checked={value} 
              onChange={() => toggleExtension(key)} 
            />
            <label htmlFor={key}>{key}</label>
          </div>
        ))}
      </div>
      <div ref={ref} style={{ height: 'calc(100vh - 50px)', width: '100%' }} />
    </div>
  );
}