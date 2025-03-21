import React from 'react';
import { createEditor } from './editor';

export default function App() {
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (ref.current) {
      createEditor(ref.current);
    }
  }, []);

  return <div ref={ref} style={{ height: '100vh', width: '100vw' }} />;
}