import { createRoot } from 'react-dom/client';
import { NodeEditor, GetSchemes, ClassicPreset } from 'rete';
import { AreaPlugin, AreaExtensions } from 'rete-area-plugin';
import { ConnectionPlugin } from 'rete-connection-plugin';
import { ReactRenderPlugin, Presets as ReactPresets } from 'rete-react-plugin';
import { CustomControl, NumberControl, TextControl } from './controls';

class Node extends ClassicPreset.Node {
  constructor(socket) {
    super('Node');
    this.addInput('port', new ClassicPreset.Input(socket));
    this.addOutput('port', new ClassicPreset.Output(socket));
    this.addControl('text', new TextControl('text', { initial: 'value' }));
    this.addControl('number', new NumberControl('number', { initial: 42 }));
    this.addControl('custom', new CustomControl('custom', { initial: 'custom value' }));
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

  render.addPreset(ReactPresets.classic.setup());

  editor.use(area);
  area.use(connection);
  area.use(render);

  AreaExtensions.simpleNodesOrder(area);

  const node1 = new Node(socket);
  const node2 = new Node(socket);

  await editor.addNode(node1);
  await editor.addNode(node2);

  await editor.addConnection(new Connection(
    node1.outputs.get('port'),
    node2.inputs.get('port')
  ));

  await area.translate(node1.id, { x: 100, y: 100 });
  await area.translate(node2.id, { x: 400, y: 100 });

  AreaExtensions.zoomAt(area, editor.getNodes());

  return {
    destroy: () => area.destroy()
  };
}