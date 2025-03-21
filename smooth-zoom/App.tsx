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

  // Use the classic connection preset for the connection lines
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

  // Setup zoom to be smooth
  AreaExtensions.simpleNodesOrder(area);
  // This is the key part for smooth zoom
  AreaExtensions.smoothZoom(area, { duration: 300 }); // Duration in milliseconds

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

  // Add keyboard controls for zoom in/out
  document.addEventListener('keydown', (e) => {
    if (e.key === '+') {
      area.zoom(0.1); // Zoom in by 10%
    } else if (e.key === '-') {
      area.zoom(-0.1); // Zoom out by 10%
    }
  });

  // Add a zoom control UI element
  const zoomControls = document.createElement('div');
  zoomControls.className = 'zoom-controls';
  zoomControls.innerHTML = `
    <button id="zoom-in">+</button>
    <button id="zoom-out">-</button>
    <button id="zoom-reset">Reset</button>
  `;
  container.appendChild(zoomControls);

  // Get the current zoom level
  document.getElementById('zoom-in')?.addEventListener('click', () => area.zoom(0.1));
  document.getElementById('zoom-out')?.addEventListener('click', () => area.zoom(-0.1));
  document.getElementById('zoom-reset')?.addEventListener('click', () => {
    area.area.zoom(1, { x: 0, y: 0 }, { duration: 500 });
  });

  // Setup auto arrangement
  await arrange.layout();
  
  // Set the initial zoom level to see all nodes
  AreaExtensions.zoomAt(area, editor.getNodes());

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
