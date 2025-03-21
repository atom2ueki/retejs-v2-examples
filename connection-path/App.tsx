import React from 'react';
import { NodeEditor, ClassicPreset, GetSchemes, Injections } from 'rete';
import { AreaPlugin, AreaExtensions } from 'rete-area-plugin';
import {
  ReactArea2D,
  ReactPlugin,
  ReactArea2DParams,
  Presets as ReactPresets
} from 'rete-react-plugin';
import { ConnectionPlugin, Presets as ConnectionPresets, BezierStrategy, PathConnectionPlugin } from 'rete-connection-plugin';
import { createRoot } from 'react-dom/client';

type Schemes = GetSchemes<
  ClassicPreset.Node,
  ClassicPreset.Connection<ClassicPreset.Node, ClassicPreset.Node>
>;
type AreaExtra = ReactArea2DParams<Schemes>;

class Connection extends ClassicPreset.Connection<
  ClassicPreset.Node,
  ClassicPreset.Node
> {}

class ANode extends ClassicPreset.Node {
  public width = 180;
  public height = 100;

  constructor(label: string, position: { x: number; y: number }) {
    super(label);
    super.position = position;

    this.addInput('port1', new ClassicPreset.Input(socket1, 'Port1'));
    this.addInput('port2', new ClassicPreset.Input(socket2, 'Port2'));
    this.addOutput('port3', new ClassicPreset.Output(socket1, 'Port3'));
    this.addOutput('port4', new ClassicPreset.Output(socket2, 'Port4'));
  }
}

const socket1 = new ClassicPreset.Socket('socket1');
const socket2 = new ClassicPreset.Socket('socket2');

type Context = Injections<{
  area: AreaPlugin<Schemes, AreaExtra>;
  connection: ConnectionPlugin<Schemes, AreaExtra>;
  pathConnection: PathConnectionPlugin<Schemes, AreaExtra>;
  reactPlugin: ReactPlugin<Schemes, AreaExtra>;
}>;

function createEditor() {
  const container = document.querySelector('#rete') as HTMLElement;
  const editor = new NodeEditor<Schemes>();
  const area = new AreaPlugin<Schemes, AreaExtra>(container);
  const connection = new ConnectionPlugin<Schemes, AreaExtra>();
  const reactPlugin = new ReactPlugin<Schemes, AreaExtra>();
  const pathConnection = new PathConnectionPlugin<Schemes, AreaExtra>();

  AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
    accumulating: AreaExtensions.accumulateOnCtrl()
  });

  connection.addPreset(ConnectionPresets.classic.setup());

  reactPlugin.addPreset(ReactPresets.classic.setup());
  reactPlugin.addPreset(ReactPresets.contextMenu.setup());
  reactPlugin.addPreset(ReactPresets.selectableNodes.setup());

  editor.use(area);
  area.use(connection);
  area.use(reactPlugin);
  area.use(pathConnection);

  const createNode = (id: number, x: number, y: number) => {
    const node = new ANode(`Node ${id}`, { x, y });
    editor.addNode(node);
    return node;
  };

  const node1 = createNode(1, 80, 200);
  const node2 = createNode(2, 500, 200);

  const connect = (output: string, input: string) => {
    editor.addConnection(
      new Connection(
        node1.outputs.get(output) as ClassicPreset.Output,
        node2.inputs.get(input) as ClassicPreset.Input
      )
    );
  };

  connect('port3', 'port1');
  connect('port4', 'port2');

  AreaExtensions.simpleNodesOrder(area);

  // Optional: add custom bezier curve strategy for connection path
  pathConnection.addPreset(() => {
    return {
      strategy: new BezierStrategy({
        curvature: 0.8
      })
    };
  });

  AreaExtensions.zoomAt(area, editor.getNodes());

  return {
    destroy: () => area.destroy(),
  };
}

export default function App() {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (ref.current) {
      ref.current.querySelector('#rete')?.remove();
      const element = document.createElement('div');
      element.id = 'rete';
      ref.current.appendChild(element);
      createEditor();
    }
  }, []);

  return (
    <div className="App">
      <div className="wrapper" ref={ref}>
        <div id="rete" className="rete"></div>
      </div>
    </div>
  );
}
