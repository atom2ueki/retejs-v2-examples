import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ClassicPreset, GetSchemes, NodeEditor } from 'rete';
import { AreaExtensions, AreaPlugin } from 'rete-area-plugin';
import { ReactPlugin, ReactArea2D } from 'rete-react-plugin';
import { ScopesPlugin, ExtractScope } from 'rete-scopes-plugin';

// Define node types
type NodeTypes = 'add' | 'number';

// Define connection types
type ConnectionTypes = 'default';

// Define scopes
type Scopes = {
  main: {
    data: 'main';
    type: NodeTypes;
    inputs: { a?: number; b?: number };
    outputs: { result: number };
  };
  branch: {
    data: 'branch';
    type: NodeTypes;
    inputs: { a?: number; b?: number };
    outputs: { result: number };
  };
};

// Define base schemes for nodes and connections
type Schemes = GetSchemes<NodeTypes, ConnectionTypes> & { scopes: Scopes };

// Define Add node
class AddNode extends ClassicPreset.Node<
  { a: ClassicPreset.Socket; b: ClassicPreset.Socket },
  { result: ClassicPreset.Socket },
  {}
> {
  width = 180;
  height = 140;

  constructor() {
    super('add');
    this.addInput('a', new ClassicPreset.Socket('default'));
    this.addInput('b', new ClassicPreset.Socket('default'));
    this.addOutput('result', new ClassicPreset.Socket('default'));
  }

  execute(input: { a?: number; b?: number }) {
    const a = input.a || 0;
    const b = input.b || 0;
    return { result: a + b };
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

  execute() {
    return { value: this.controls.value.value || 0 };
  }
}

// Specify types for scope plugins
type MainScope = ExtractScope<Schemes['scopes'], 'main'>;
type BranchScope = ExtractScope<Schemes['scopes'], 'branch'>;

function App() {
  const editorRef = useRef<NodeEditor<Schemes> | null>(null);
  const areaRef = useRef<AreaPlugin<Schemes, ReactArea2D<Schemes>> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scopeSelector, setScopeSelector] = useState<'main' | 'branch'>('main');

  useEffect(() => {
    if (!containerRef.current) return;

    // Create node editor
    const editor = new NodeEditor<Schemes>();
    
    // Create scopes plugin
    const scopes = new ScopesPlugin<Schemes>();
    
    // Create area
    const area = new AreaPlugin<Schemes, ReactArea2D<Schemes>>(containerRef.current);
    
    // Configure React rendering for the area
    const reactPlugin = new ReactPlugin<Schemes, ReactArea2D<Schemes>>();

    // Add plugins to the editor
    editor.use(area);
    editor.use(scopes);
    area.use(reactPlugin);
    
    // Create main scope
    const mainScope = scopes.createScope<MainScope>('main');
    
    // Set up nodes for main scope
    const number1 = new NumberNode(1);
    const number2 = new NumberNode(2);
    const add = new AddNode();

    // Add nodes to main scope
    mainScope.addNode(number1);
    mainScope.addNode(number2);
    mainScope.addNode(add);

    // Position nodes
    mainScope.translate(number1.id, { x: 100, y: 200 });
    mainScope.translate(number2.id, { x: 100, y: 400 });
    mainScope.translate(add.id, { x: 400, y: 300 });

    // Connect nodes
    mainScope.addConnection(new ClassicPreset.Connection(number1, 'value', add, 'a'));
    mainScope.addConnection(new ClassicPreset.Connection(number2, 'value', add, 'b'));

    // Create branch scope
    const branchScope = scopes.createScope<BranchScope>('branch');
    
    // Set up nodes for branch scope
    const number3 = new NumberNode(10);
    const number4 = new NumberNode(20);
    const add2 = new AddNode();

    // Add nodes to branch scope
    branchScope.addNode(number3);
    branchScope.addNode(number4);
    branchScope.addNode(add2);

    // Position nodes
    branchScope.translate(number3.id, { x: 100, y: 200 });
    branchScope.translate(number4.id, { x: 100, y: 400 });
    branchScope.translate(add2.id, { x: 400, y: 300 });

    // Connect nodes
    branchScope.addConnection(new ClassicPreset.Connection(number3, 'value', add2, 'a'));
    branchScope.addConnection(new ClassicPreset.Connection(number4, 'value', add2, 'b'));

    // Set active scope
    scopes.setActiveScope('main');

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

  // Handle scope change
  useEffect(() => {
    if (!editorRef.current) return;
    const scopesPlugin = editorRef.current.getPlugin<ScopesPlugin<Schemes>>('scopes');
    if (scopesPlugin) {
      scopesPlugin.setActiveScope(scopeSelector);
    }
  }, [scopeSelector]);

  return (
    <div style={{ height: '100vh' }}>
      <div style={{ padding: '10px', background: '#f5f5f5', marginBottom: '10px' }}>
        <h3>Rete.js v2 Scopes Example</h3>
        <p>This example demonstrates scopes implementation with Rete.js v2.</p>
        <div style={{ marginTop: '10px' }}>
          <span style={{ marginRight: '10px' }}>Active scope:</span>
          <button 
            onClick={() => setScopeSelector('main')}
            style={{ 
              marginRight: '10px', 
              padding: '5px 10px',
              backgroundColor: scopeSelector === 'main' ? '#4CAF50' : '#f1f1f1',
              color: scopeSelector === 'main' ? 'white' : 'black',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Main
          </button>
          <button 
            onClick={() => setScopeSelector('branch')}
            style={{ 
              padding: '5px 10px',
              backgroundColor: scopeSelector === 'branch' ? '#4CAF50' : '#f1f1f1',
              color: scopeSelector === 'branch' ? 'white' : 'black',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Branch
          </button>
        </div>
      </div>
      <div 
        ref={containerRef} 
        style={{ 
          height: 'calc(100% - 120px)',
          width: '100%',
          overflow: 'hidden',
          background: 'white'
        }}
      />
    </div>
  );
}

export default App;
