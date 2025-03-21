import { createRoot } from 'react-dom/client';
import { NodeEditor, GetSchemes, ClassicPreset } from 'rete';
import { AreaPlugin, AreaExtensions } from 'rete-area-plugin';
import { ConnectionPlugin } from 'rete-connection-plugin';
import { ReactRenderPlugin, Presets as ReactPresets } from 'rete-react-plugin';

class Node extends ClassicPreset.Node {
  constructor(socket, label) {
    super(label || 'Node');
    this.addInput('in', new ClassicPreset.Input(socket));
    this.addOutput('out', new ClassicPreset.Output(socket));
    this.addControl('text', new ClassicPreset.InputControl('text', { initial: 'Property' }));
  }
}

class Connection extends ClassicPreset.Connection {
  constructor(source, target) {
    super(source, target);
  }
}

export async function createEditor(container, options = {}) {
  const socket = new ClassicPreset.Socket('socket');

  const editor = new NodeEditor();
  const area = new AreaPlugin(container);
  const connection = new ConnectionPlugin();
  const render = new ReactRenderPlugin({ createRoot });

  // Apply enabled extensions based on options
  if (options.selectNodes) {
    AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
      accumulating: options.accumulateSelection ? AreaExtensions.accumulateOnCtrl() : undefined
    });
  }

  if (options.snapGrid) {
    AreaExtensions.snapGrid(area, { size: 30 });
  }

  if (options.showGrid) {
    AreaExtensions.showGrid(area);
  }

  render.addPreset(ReactPresets.classic.setup());

  editor.use(area);
  area.use(connection);
  area.use(render);

  AreaExtensions.simpleNodesOrder(area);

  // Create nodes in different locations forming a small network
  const nodes = [
    { node: new Node(socket, 'Input'), position: { x: 0, y: 0 } },
    { node: new Node(socket, 'Process 1'), position: { x: 300, y: -100 } },
    { node: new Node(socket, 'Process 2'), position: { x: 300, y: 100 } },
    { node: new Node(socket, 'Output'), position: { x: 600, y: 0 } }
  ];

  // Add all nodes
  for (const { node, position } of nodes) {
    await editor.addNode(node);
    await area.translate(node.id, position);
  }

  // Create connections
  await editor.addConnection(new Connection(
    nodes[0].node.outputs.get('out'),
    nodes[1].node.inputs.get('in')
  ));
  
  await editor.addConnection(new Connection(
    nodes[0].node.outputs.get('out'),
    nodes[2].node.inputs.get('in')
  ));
  
  await editor.addConnection(new Connection(
    nodes[1].node.outputs.get('out'),
    nodes[3].node.inputs.get('in')
  ));
  
  await editor.addConnection(new Connection(
    nodes[2].node.outputs.get('out'),
    nodes[3].node.inputs.get('in')
  ));

  // Add minimap if enabled
  if (options.minimap) {
    const minimap = document.createElement('div');
    minimap.style.position = 'absolute';
    minimap.style.right = '20px';
    minimap.style.bottom = '20px';
    minimap.style.width = '200px';
    minimap.style.height = '150px';
    minimap.style.backgroundColor = 'rgba(0,0,0,0.1)';
    minimap.style.border = '1px solid #999';
    container.appendChild(minimap);
  
    AreaExtensions.minimap(area, {
      container: minimap,
      size: { width: 200, height: 150 }
    });
  }

  // Zoom to fit all nodes
  AreaExtensions.zoomAt(area, editor.getNodes());

  return {
    destroy: () => area.destroy()
  };
}