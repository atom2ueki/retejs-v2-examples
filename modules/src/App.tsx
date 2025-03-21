import React, { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { ClassicPreset, GetSchemes, NodeEditor } from 'rete';
import { AreaExtensions, AreaPlugin } from 'rete-area-plugin';
import { ReactPlugin, ReactArea2D } from 'rete-react-plugin';
import { DataflowEngine, DataflowNode } from 'rete-engine';
import { ModulePlugin } from 'rete-module-plugin';

// Define node types
type NodeTypes = 'add' | 'number' | 'output' | 'input' | 'module';

// Define connection types
type ConnectionTypes = 'default';

// Define base schemes for nodes and connections
type Schemes = GetSchemes<NodeTypes, ConnectionTypes>;

// Define Add node
class AddNode extends ClassicPreset.Node<
  { left: ClassicPreset.Socket; right: ClassicPreset.Socket },
  { out: ClassicPreset.Socket },
  {}
> implements DataflowNode {
  width = 180;
  height = 140;

  constructor() {
    super('add');
    this.addInput('left', new ClassicPreset.Socket('default'));
    this.addInput('right', new ClassicPreset.Socket('default'));
    this.addOutput('out', new ClassicPreset.Socket('default'));
  }

  // Implement data method for dataflow
  data(inputs: { left?: number[]; right?: number[] }): { out: number } {
    const left = inputs.left ? inputs.left[0] : 0;
    const right = inputs.right ? inputs.right[0] : 0;
    
    return {
      out: left + right
    };
  }
}

// Define Number node
class NumberNode extends ClassicPreset.Node<
  {},
  { value: ClassicPreset.Socket },
  { value: ClassicPreset.InputControl<'number'> }
> implements DataflowNode {
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

// Define Output node for modules
class OutputNode extends ClassicPreset.Node<
  { value: ClassicPreset.Socket },
  {},
  {}
> implements DataflowNode {
  width = 180;
  height = 120;

  constructor() {
    super('output');
    this.addInput('value', new ClassicPreset.Socket('default'));
  }

  data(inputs: { value?: number[] }) {
    return {}
  }
}

// Define Input node for modules
class InputNode extends ClassicPreset.Node<
  {},
  { value: ClassicPreset.Socket },
  {}
> implements DataflowNode {
  width = 180;
  height = 120;

  constructor() {
    super('input');
    this.addOutput('value', new ClassicPreset.Socket('default'));
  }

  data(inputs: {}) {
    return { value: 0 }
  }
}

// Define Module node
class ModuleNode extends ClassicPreset.Node<
  { input: ClassicPreset.Socket },
  { output: ClassicPreset.Socket },
  {}
> implements DataflowNode {
  width = 180;
  height = 120;

  constructor(name: string) {
    super('module');
    this.label = name;
    this.addInput('input', new ClassicPreset.Socket('default'));
    this.addOutput('output', new ClassicPreset.Socket('default'));
  }

  data(inputs: { input?: number[] }) {
    return { output: inputs.input ? inputs.input[0] : 0 }
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
    
    // Create dataflow engine
    const dataflow = new DataflowEngine<Schemes>();
    
    // Create module plugin
    const modulePlugin = new ModulePlugin<Schemes>();
    
    // Create area
    const area = new AreaPlugin<Schemes, ReactArea2D<Schemes>>(containerRef.current);
    
    // Configure React rendering for the area
    const reactPlugin = new ReactPlugin<Schemes, ReactArea2D<Schemes>>();

    // Add plugins to the editor
    editor.use(area);
    editor.use(dataflow);
    editor.use(modulePlugin);
    area.use(reactPlugin);
    
    // Register node types for module plugin
    modulePlugin.addNodeType('number', () => new NumberNode(0));
    modulePlugin.addNodeType('add', () => new AddNode());
    modulePlugin.addNodeType('input', () => new InputNode());
    modulePlugin.addNodeType('output', () => new OutputNode());

    // Create a module
    const moduleId = 'adderModule';
    modulePlugin.createModule(moduleId);
    
    // Create nodes for module
    const input = new InputNode();
    const add = new AddNode();
    const number = new NumberNode(5);
    const output = new OutputNode();

    // Add nodes to module
    modulePlugin.addNode(moduleId, input);
    modulePlugin.addNode(moduleId, add);
    modulePlugin.addNode(moduleId, number);
    modulePlugin.addNode(moduleId, output);

    // Position nodes in module
    modulePlugin.translate(moduleId, input.id, { x: 100, y: 200 });
    modulePlugin.translate(moduleId, add.id, { x: 400, y: 200 });
    modulePlugin.translate(moduleId, number.id, { x: 100, y: 400 });
    modulePlugin.translate(moduleId, output.id, { x: 700, y: 200 });

    // Connect nodes in module
    modulePlugin.addConnection(
      moduleId,
      new ClassicPreset.Connection(input, 'value', add, 'left')
    );
    modulePlugin.addConnection(
      moduleId,
      new ClassicPreset.Connection(number, 'value', add, 'right')
    );
    modulePlugin.addConnection(
      moduleId,
      new ClassicPreset.Connection(add, 'out', output, 'value')
    );

    // Setup main editor
    const moduleNode = new ModuleNode('Adder Module');
    const inputNode = new NumberNode(10);
    
    // Add nodes to main editor
    editor.addNode(moduleNode);
    editor.addNode(inputNode);
    
    // Position nodes in main editor
    area.translate(moduleNode.id, { x: 400, y: 200 });
    area.translate(inputNode.id, { x: 100, y: 200 });
    
    // Connect module node
    editor.addConnection(
      new ClassicPreset.Connection(inputNode, 'value', moduleNode, 'input')
    );
    
    // Register module node with module plugin
    modulePlugin.registerModule(moduleId, moduleNode);

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
        <h3>Rete.js v2 Modules (Dataflow) Example</h3>
        <p>This example demonstrates modules and dataflow implementation with Rete.js v2.</p>
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
