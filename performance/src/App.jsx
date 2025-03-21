import React from 'react';
import { createEditor } from './editor';

export default function App() {
  const ref = React.useRef(null);
  const [count, setCount] = React.useState(100);

  React.useEffect(() => {
    if (ref.current) {
      // Clear any previous editor instance
      ref.current.innerHTML = '';
      createEditor(ref.current, count);
    }
  }, [count]);

  return (
    <div>
      <div style={{ padding: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <label>Number of nodes:</label>
        <input 
          type="number" 
          value={count} 
          onChange={(e) => setCount(parseInt(e.target.value))} 
          min="10" 
          max="10000" 
          style={{ width: '100px' }}
        />
        <span>Current: {count} nodes</span>
      </div>
      <div ref={ref} style={{ height: 'calc(100vh - 50px)', width: '100%' }} />
    </div>
  );
}