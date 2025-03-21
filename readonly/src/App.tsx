import React, { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { ClassicPreset, GetSchemes, NodeEditor } from 'rete';
import { AreaExtensions, AreaPlugin } from 'rete-area-plugin';
import { ReactPlugin, ReactArea2D } from 'rete-react-plugin';

// Define node types
type NodeTypes = 'add' | 'number';

// Define connection types
type ConnectionTypes = 'default';

// Define base schemes for nodes and connections
type Schemes = GetSchemes<NodeTypes, ConnectionTypes>;

// Define Add node
class AddNode extends ClassicPreset.Node<
  { a: ClassicPreset.Socket; b: ClassicPreset.Socket },
  { sum: ClassicPreset.Socket },
  { value: ClassicPreset.InputControl<'number'> }
> {
  width = 180;
  height = 140;

  constructor(initial: number) {
    super('add');
    this.addInput('a', new ClassicPreset.Socket('default'));
    this.addInput('b', new ClassicPreset.Socket('default'));
    this.addOutput('sum', new ClassicPreset.Socket('default'));
    this.addControl(
      'value',
      new ClassicPreset.InputControl('number', { initial })
    );
  }

  data(): { value: number } {
    return {
      value: this.controls.value.value || 0
    };
  }
}

// Define Number node
class NumberNode extends ClassicPreset.Node<
  {},
  { value: ClassicPreset.Socket },
  { value: ClassicPreset.InputControl<'number'> }
> {
  width = 180;
  height = 120;

  constructor(initial: number) {
    super('number');
    this.addOutput('value', new ClassicPreset.Socket('default'));
    this.addControl(
      'value',
      new ClassicPreset.InputControl('number', { initial })
    );
  }

  data(): { value: number } {
    return {
      value: this.controls.value.value || 0
    };
  }
}

function App() {
  const editorRef = useRef<NodeEditor<Schemes> | null>(null);
  const areaRef = useRef<AreaPlugin<Schemes, ReactArea2D<Schemes>> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create node editor
    const editor = new NodeEditor<Schemes>();
    
    // Create area
    const area = new AreaPlugin<Schemes, ReactArea2D<Schemes>>(containerRef.current);
    
    // Configure React rendering for the area
    const reactPlugin = new ReactPlugin<Schemes, ReactArea2D<Schemes>>();

    // Add plugins to the editor
    editor.use(area);
    area.use(reactPlugin);
    
    // Make editor read-only
    AreaExtensions.selectableNodes(area, false);
    
    // Setup nodes
    const number1 = new NumberNode(1);
    const number2 = new NumberNode(2);
    const add = new AddNode(0);

    // Add nodes to editor
    editor.addNode(number1);
    editor.addNode(number2);
    editor.addNode(add);

    // Position nodes
    area.translate(number1.id, { x: 300, y: 200 });
    area.translate(number2.id, { x: 300, y: 400 });
    area.translate(add.id, { x: 600, y: 300 });

    // Connect nodes
    editor.addConnection(new ClassicPreset.Connection(number1, 'value', add, 'a'));
    editor.addConnection(new ClassicPreset.Connection(number2, 'value', add, 'b'));

    // Arrange nodes
    AreaExtensions.simpleNodesOrder(area);
    
    // Setup viewport
    const selector = area.area.querySelector<HTMLElement>('.rete-area-content')!;

    AreaExtensions.showGrid(area);
    
    // Store references
    editorRef.current = editor;
    areaRef.current = area;

    // Return cleanup function
    return () => {
      editor.destroy();
    };
  }, []);

  return (
    <div style={{ height: '100vh' }}>
      <div style={{ padding: '10px', background: '#f5f5f5', marginBottom: '10px' }}>
        <h3>Rete.js v2 Readonly Example</h3>
        <p>This example demonstrates a read-only node editor.</p>
      </div>
      <div 
        ref={containerRef} 
        style={{ 
          height: 'calc(100% - 80px)',
          width: '100%',
          overflow: 'hidden',
          background: 'white'
        }}
      />
    </div>
  );
}

export default App;
