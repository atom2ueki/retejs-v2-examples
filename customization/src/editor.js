import { createRoot } from 'react-dom/client';
import { NodeEditor, ClassicPreset } from 'rete';
import { AreaPlugin, AreaExtensions } from 'rete-area-plugin';
import { ConnectionPlugin, Presets as ConnectionPresets } from 'rete-connection-plugin';
import { ReactRenderPlugin } from 'rete-react-plugin';
import { CustomNode } from './CustomNode';
import { CustomConnection } from './CustomConnection';
import { CustomSocket } from './CustomSocket';

class Node extends ClassicPreset.Node {
  constructor(socket) {
    super('Custom node');
    this.addInput('in', new ClassicPreset.Input(socket));
    this.addOutput('out', new ClassicPreset.Output(socket));
    this.addControl('text', new ClassicPreset.InputControl('text', { initial: 'Edit me' }));
  }
}

class Connection extends ClassicPreset.Connection {
  constructor(source, target) {
    super(source, target);
  }
}

export async function createEditor(container) {
  const socket = new ClassicPreset.Socket('socket');

  const editor = new NodeEditor();
  const area = new AreaPlugin(container);
  const connection = new ConnectionPlugin();
  const render = new ReactRenderPlugin({ createRoot });

  AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
    accumulating: AreaExtensions.accumulateOnCtrl()
  });

  // Add custom render components
  render.addPreset(()=> ({
    node(context) {
      return {
        component: CustomNode,
      };
    },
    connection(context) {
      return {
        component: CustomConnection,
      };
    },
    socket(context) {
      return {
        component: CustomSocket,
      };
    },
  }));

  connection.addPreset(ConnectionPresets.classic.setup());

  editor.use(area);
  area.use(connection);
  area.use(render);

  AreaExtensions.simpleNodesOrder(area);

  const node1 = new Node(socket);
  const node2 = new Node(socket);
  const node3 = new Node(socket);

  await editor.addNode(node1);
  await editor.addNode(node2);
  await editor.addNode(node3);

  await editor.addConnection(new Connection(
    node1.outputs.get('out'),
    node2.inputs.get('in')
  ));
  
  await editor.addConnection(new Connection(
    node2.outputs.get('out'),
    node3.inputs.get('in')
  ));

  await area.translate(node1.id, { x: 100, y: 100 });
  await area.translate(node2.id, { x: 400, y: 100 });
  await area.translate(node3.id, { x: 700, y: 100 });

  AreaExtensions.zoomAt(area, editor.getNodes());

  return {
    destroy: () => area.destroy()
  };
}