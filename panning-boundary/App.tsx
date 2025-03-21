import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { NodeEditor, GetSchemes, ClassicPreset } from 'rete';
import { AreaPlugin, AreaExtensions } from 'rete-area-plugin';
import { ReactAreaPlugin, Presets as ReactPresets } from 'rete-react-plugin';
import { ConnectionPlugin } from 'rete-connection-plugin';
import { AutoArrangePlugin } from 'rete-auto-arrange-plugin';

// Define the node and connection types
type Schemes = GetSchemes<
  ClassicPreset.Node,
  ClassicPreset.Connection<ClassicPreset.Node, ClassicPreset.Node>
>;

class Node extends ClassicPreset.Node {
  constructor(public title: string) {
    super(title);
  }
}

// Create a boundary visualization component
function BoundaryVisualization({ boundary }: { boundary: { left: number; top: number; right: number; bottom: number } }) {
  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        border: '2px dashed rgba(255, 0, 0, 0.5)',
        backgroundColor: 'rgba(255, 0, 0, 0.05)',
        left: boundary.left,
        top: boundary.top,
        width: boundary.right - boundary.left,
        height: boundary.bottom - boundary.top,
        zIndex: -1
      }}
    />
  );
}

// Setup the editor
async function setup() {
  const container = document.querySelector('#rete') as HTMLElement;
  const editor = new NodeEditor<Schemes>();
  const area = new AreaPlugin<Schemes>(container);
  const connection = new ConnectionPlugin<Schemes>();
  const reactRender = new ReactAreaPlugin<Schemes>();
  const arrange = new AutoArrangePlugin<Schemes>();

  // Register the plugins
  editor.use(area);
  area.use(reactRender);
  area.use(connection);
  area.use(arrange);

  // Use the classic preset for rendering
  reactRender.use(ReactPresets.classic.setup({
    customize: {
      node(context) {
        return ReactPresets.classic.Node(context);
      },
      connection(context) {
        return ReactPresets.classic.Connection(context);
      },
      socket(context) {
        return ReactPresets.classic.Socket(context);
      }
    }
  }));

  AreaExtensions.simpleNodesOrder(area);

  // Define the boundary (in local coordinates)
  const boundary = {
    left: -500,   // Min x coordinate
    top: -300,    // Min y coordinate
    right: 1000,  // Max x coordinate
    bottom: 600   // Max y coordinate
  };

  // Create a boundary visualization element
  const boundaryElement = document.createElement('div');
  boundaryElement.id = 'boundary-visualization';
  container.appendChild(boundaryElement);
  const boundaryRoot = createRoot(boundaryElement);
  boundaryRoot.render(<BoundaryVisualization boundary={boundary} />);

  // Add panning limits to restrict movement within the boundary
  AreaExtensions.restrictivelePanning(area, boundary);

  // Add control panel for boundary configuration
  const controlPanel = document.createElement('div');
  controlPanel.className = 'control-panel';
  controlPanel.innerHTML = `
    <h3>Boundary Settings</h3>
    <div class="control-group">
      <label>Left:</label>
      <input type="number" id="boundary-left" value="${boundary.left}" />
    </div>
    <div class="control-group">
      <label>Top:</label>
      <input type="number" id="boundary-top" value="${boundary.top}" />
    </div>
    <div class="control-group">
      <label>Right:</label>
      <input type="number" id="boundary-right" value="${boundary.right}" />
    </div>
    <div class="control-group">
      <label>Bottom:</label>
      <input type="number" id="boundary-bottom" value="${boundary.bottom}" />
    </div>
    <button id="update-boundary">Update Boundary</button>
    <button id="reset-boundary">Reset</button>
    <button id="toggle-boundary-visible">Toggle Boundary</button>
  `;
  container.appendChild(controlPanel);

  // Add event listeners for boundary controls
  document.getElementById('update-boundary')?.addEventListener('click', () => {
    const newBoundary = {
      left: parseInt((document.getElementById('boundary-left') as HTMLInputElement).value),
      top: parseInt((document.getElementById('boundary-top') as HTMLInputElement).value),
      right: parseInt((document.getElementById('boundary-right') as HTMLInputElement).value),
      bottom: parseInt((document.getElementById('boundary-bottom') as HTMLInputElement).value)
    };

    // Update the boundary visualization
    boundaryRoot.render(<BoundaryVisualization boundary={newBoundary} />);

    // Remove the old panning restriction
    area.removePipe(area.pipes.find(pipe => pipe.name === 'restrictive-panning')!);

    // Add new panning restriction
    AreaExtensions.restrictivelePanning(area, newBoundary);
  });

  document.getElementById('reset-boundary')?.addEventListener('click', () => {
    const defaultBoundary = {
      left: -500,
      top: -300,
      right: 1000,
      bottom: 600
    };

    // Update input fields
    (document.getElementById('boundary-left') as HTMLInputElement).value = defaultBoundary.left.toString();
    (document.getElementById('boundary-top') as HTMLInputElement).value = defaultBoundary.top.toString();
    (document.getElementById('boundary-right') as HTMLInputElement).value = defaultBoundary.right.toString();
    (document.getElementById('boundary-bottom') as HTMLInputElement).value = defaultBoundary.bottom.toString();

    // Update the boundary visualization
    boundaryRoot.render(<BoundaryVisualization boundary={defaultBoundary} />);

    // Remove the old panning restriction
    area.removePipe(area.pipes.find(pipe => pipe.name === 'restrictive-panning')!);

    // Add new panning restriction
    AreaExtensions.restrictivelePanning(area, defaultBoundary);
  });

  // Toggle boundary visibility
  let boundaryVisible = true;
  document.getElementById('toggle-boundary-visible')?.addEventListener('click', () => {
    boundaryVisible = !boundaryVisible;
    const element = document.getElementById('boundary-visualization');
    if (element) {
      element.style.display = boundaryVisible ? 'block' : 'none';
    }
  });

  // Add some sample nodes
  const node1 = new Node('Node 1');
  const node2 = new Node('Node 2');
  const node3 = new Node('Node 3');

  // Add inputs and outputs to the nodes
  node1.addOutput('output', new ClassicPreset.Output(socket));
  node2.addInput('input', new ClassicPreset.Input(socket));
  node2.addOutput('output', new ClassicPreset.Output(socket));
  node3.addInput('input', new ClassicPreset.Input(socket));

  // Position the nodes
  await editor.addNode(node1);
  await area.translate(node1.id, { x: 100, y: 100 });

  await editor.addNode(node2);
  await area.translate(node2.id, { x: 400, y: 100 });

  await editor.addNode(node3);
  await area.translate(node3.id, { x: 700, y: 100 });

  // Connect the nodes
  await editor.addConnection(new ClassicPreset.Connection(node1, 'output', node2, 'input'));
  await editor.addConnection(new ClassicPreset.Connection(node2, 'output', node3, 'input'));

  // Add helper functions to demonstrate edge cases
  const addButtonsContainer = document.createElement('div');
  addButtonsContainer.className = 'add-nodes-buttons';
  addButtonsContainer.innerHTML = `
    <button id="add-inside">Add Node Inside Boundary</button>
    <button id="add-outside">Try to Add Node Outside Boundary</button>
    <button id="focus-all">Focus All Nodes</button>
  `;
  container.appendChild(addButtonsContainer);

  // Add node inside boundary
  document.getElementById('add-inside')?.addEventListener('click', async () => {
    const node = new Node('Inside Node');
    node.addInput('input', new ClassicPreset.Input(socket));
    node.addOutput('output', new ClassicPreset.Output(socket));
    
    await editor.addNode(node);
    // Pick a random position inside the boundary
    const x = Math.floor(Math.random() * (boundary.right - boundary.left - 200)) + boundary.left + 100;
    const y = Math.floor(Math.random() * (boundary.bottom - boundary.top - 100)) + boundary.top + 50;
    await area.translate(node.id, { x, y });
  });

  // Try to add node outside boundary (will be created but panning will be limited)
  document.getElementById('add-outside')?.addEventListener('click', async () => {
    const node = new Node('Outside Node');
    node.addInput('input', new ClassicPreset.Input(socket));
    node.addOutput('output', new ClassicPreset.Output(socket));
    
    await editor.addNode(node);
    // Pick a position outside boundary
    const side = Math.floor(Math.random() * 4);
    let x, y;
    
    switch (side) {
      case 0: // Left
        x = boundary.left - 300;
        y = (boundary.top + boundary.bottom) / 2;
        break;
      case 1: // Top
        x = (boundary.left + boundary.right) / 2;
        y = boundary.top - 300;
        break;
      case 2: // Right
        x = boundary.right + 300;
        y = (boundary.top + boundary.bottom) / 2;
        break;
      case 3: // Bottom
        x = (boundary.left + boundary.right) / 2;
        y = boundary.bottom + 300;
        break;
    }
    
    await area.translate(node.id, { x, y });
    alert('Node created outside boundary! Try to pan to it - you will be limited by the boundary.');
  });

  // Focus all nodes
  document.getElementById('focus-all')?.addEventListener('click', () => {
    AreaExtensions.zoomAt(area, editor.getNodes());
  });

  return {
    destroy: () => area.destroy()
  };
}

const socket = new ClassicPreset.Socket('socket');

export function App() {
  const [ref, setRef] = React.useState<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (ref) {
      setup();
    }
  }, [ref]);

  return (
    <div className="App">
      <div
        id="rete"
        ref={setRef}
        style={{
          width: '100vw',
          height: '100vh',
          position: 'absolute',
          top: 0,
          left: 0
        }}
      />
    </div>
  );
}

export default App;
