import { createRoot } from 'react-dom/client';
import { NodeEditor, GetSchemes, ClassicPreset } from 'rete';
import { AreaPlugin, AreaExtensions } from 'rete-area-plugin';
import { ConnectionPlugin } from 'rete-connection-plugin';
import { ReactRenderPlugin, Presets as ReactPresets } from 'rete-react-plugin';

class Node extends ClassicPreset.Node {
  constructor(socket) {
    super('Node');
    this.addInput('port', new ClassicPreset.Input(socket));
    this.addOutput('port', new ClassicPreset.Output(socket));
  }
}

class Connection extends ClassicPreset.Connection {
  constructor(source, target) {
    super(source, target);
  }
}

export async function createEditor(container, count = 100) {
  const socket = new ClassicPreset.Socket('socket');

  const editor = new NodeEditor();
  const area = new AreaPlugin(container);
  const connection = new ConnectionPlugin();
  const render = new ReactRenderPlugin({ createRoot });

  // Enable area selection features
  AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
    accumulating: AreaExtensions.accumulateOnCtrl()
  });

  // Set up renderer with classic preset
  render.addPreset(ReactPresets.classic.setup());

  // Connect plugins
  editor.use(area);
  area.use(connection);
  area.use(render);

  AreaExtensions.simpleNodesOrder(area);

  // Create grid layout of nodes
  const grid = Math.ceil(Math.sqrt(count));
  const spacing = 250;
  const startX = -(grid * spacing) / 2;
  const startY = -(grid * spacing) / 2;

  console.time('Creating nodes');
  
  // Create nodes in a batch for better performance
  const nodes = [];
  const connections = [];
  
  for (let i = 0; i < count; i++) {
    const node = new Node(socket);
    nodes.push(node);
  }
  
  // Add all nodes at once
  await editor.addNodes(nodes);
  
  // Create connections - every node connects to the next one in the list
  for (let i = 0; i < nodes.length - 1; i++) {
    connections.push(
      new Connection(
        nodes[i].outputs.get('port'),
        nodes[i + 1].inputs.get('port')
      )
    );
  }
  
  // Add all connections at once
  await editor.addConnections(connections);
  
  // Position nodes in a grid layout
  const positions = [];
  for (let i = 0; i < nodes.length; i++) {
    const row = Math.floor(i / grid);
    const col = i % grid;
    positions.push({
      id: nodes[i].id,
      position: { x: startX + col * spacing, y: startY + row * spacing }
    });
  }
  
  // Apply all positions at once
  await area.translateMultiple(positions);
  
  console.timeEnd('Creating nodes');
  
  // Zoom to fit all nodes
  AreaExtensions.zoomAt(area, editor.getNodes());

  return {
    destroy: () => area.destroy()
  };
}