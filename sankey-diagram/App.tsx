import React from 'react';
import { NodeEditor, ClassicPreset, GetSchemes, ConnectionPlugin, Injections } from 'rete';
import { AreaPlugin, AreaExtensions } from 'rete-area-plugin';
import {
  ReactArea2D,
  ReactPlugin,
  ReactArea2DParams,
  Presets as ReactPresets
} from 'rete-react-plugin';
import { createRoot } from 'react-dom/client';
import { ArrangeAppliers, AutoArrangePlugin } from 'rete-auto-arrange-plugin';
import { SankeyPlugin, SankeySocketPosition, SankeyPresets } from 'rete-sankey-plugin';

type Schemes = GetSchemes<
  ClassicPreset.Node,
  ClassicPreset.Connection<ClassicPreset.Node, ClassicPreset.Node>
>;
type AreaExtra = ReactArea2DParams<Schemes>;

class ANode extends ClassicPreset.Node {
  public width = 180;
  public height = 60;

  constructor(
    socket: ClassicPreset.Socket,
    inputs: number,
    outputs: number,
    label: string,
    position: { x: number; y: number }
  ) {
    super(label);
    super.position = position;

    if (inputs) {
      this.addInput(
        'input',
        new ClassicPreset.Input(socket, 'Input', inputs > 1)
      );
    }
    if (outputs) {
      this.addOutput(
        'output',
        new ClassicPreset.Output(socket, 'Output', outputs > 1)
      );
    }
  }
}

type Context = Injections<{
  area: AreaPlugin<Schemes, AreaExtra>;
  arrange: AutoArrangePlugin<Schemes, AreaExtra>;
  connection: ConnectionPlugin<Schemes, AreaExtra>;
  reactPlugin: ReactPlugin<Schemes, AreaExtra>;
  sankey: SankeyPlugin<Schemes, AreaExtra>;
}>;

function createEditor() {
  const container = document.querySelector('#rete') as HTMLElement;
  const editor = new NodeEditor<Schemes>();
  const area = new AreaPlugin<Schemes, AreaExtra>(container);
  const reactPlugin = new ReactPlugin<Schemes, AreaExtra>();
  const connection = new ConnectionPlugin<Schemes, AreaExtra>();
  const arrange = new AutoArrangePlugin<Schemes, AreaExtra>();
  const sankeyPlugin = new SankeyPlugin<Schemes, AreaExtra>();

  AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
    accumulating: false
  });

  const socket = new ClassicPreset.Socket('socket');

  editor.use(area);
  area.use(reactPlugin);
  area.use(connection);
  area.use(arrange);
  area.use(sankeyPlugin);

  reactPlugin.addPreset(ReactPresets.classic.setup());
  reactPlugin.addPreset(ReactPresets.contextMenu.setup());

  arrange.addPreset(ArrangeAppliers.horizontal());

  const addNode = (id: number, x: number, y: number, inputs: number, outputs: number) => {
    const node = new ANode(socket, inputs, outputs, `Node ${id}`, { x, y });
    editor.addNode(node);
    return node;
  };

  connection.addPreset(() => {
    return {
      socketPositionWatcher: new SankeySocketPosition(sankeyPlugin)
    };
  });

  sankeyPlugin.addPreset(SankeyPresets.classic.setup({
    spacing: 70,
    nodeWidth: 180,
    nodeHeight: 70,
    distanceMin: 150
  }));

  const createFlow = () => {
    const node1 = addNode(1, 0, 0, 0, 1);
    const node2 = addNode(2, 0, 150, 1, 2);
    const node3 = addNode(3, 0, 300, 1, 0);
    const node4 = addNode(4, 0, 450, 1, 0);

    editor.addConnection(
      new ClassicPreset.Connection(
        node1.outputs.get('output') as ClassicPreset.Output,
        node2.inputs.get('input') as ClassicPreset.Input
      )
    );

    editor.addConnection(
      new ClassicPreset.Connection(
        node2.outputs.get('output') as ClassicPreset.Output,
        node3.inputs.get('input') as ClassicPreset.Input,
        { index: 0 }
      )
    );

    editor.addConnection(
      new ClassicPreset.Connection(
        node2.outputs.get('output') as ClassicPreset.Output,
        node4.inputs.get('input') as ClassicPreset.Input,
        { index: 1 }
      )
    );

    return editor.getNodes();
  };

  const nodes = createFlow();

  sankeyPlugin.layout(nodes);

  AreaExtensions.zoomAt(area, nodes);
  return {
    area,
    editor
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
