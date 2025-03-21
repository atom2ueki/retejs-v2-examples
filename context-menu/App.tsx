import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { NodeEditor, GetSchemes, ClassicPreset } from 'rete';
import { AreaPlugin, AreaExtensions } from 'rete-area-plugin';
import { ReactAreaPlugin, Presets as ReactPresets } from 'rete-react-plugin';
import { ConnectionPlugin } from 'rete-connection-plugin';

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

// Context menu component
function ContextMenu(props: {
  items: Array<{
    label: string;
    onClick: () => void;
    key: string;
  }>;
  position: { x: number; y: number };
  onClose: () => void;
}) {
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        props.onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRef, props.onClose]);

  return (
    <div
      ref={menuRef}
      className="context-menu"
      style={{
        position: 'absolute',
        left: props.position.x,
        top: props.position.y,
        backgroundColor: '#fff',
        boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.2)',
        borderRadius: '3px',
        padding: '5px 0',
        zIndex: 1000
      }}
    >
      {props.items.map((item) => (
        <div
          key={item.key}
          className="context-menu-item"
          onClick={() => {
            item.onClick();
            props.onClose();
          }}
          style={{
            padding: '8px 15px',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            fontSize: '14px'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#f5f5f5';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
}

// Setup the editor
async function setup() {
  const container = document.querySelector('#rete') as HTMLElement;
  const editor = new NodeEditor<Schemes>();
  const area = new AreaPlugin<Schemes>(container);
  const connection = new ConnectionPlugin<Schemes>();
  const reactRender = new ReactAreaPlugin<Schemes>();

  // Register the plugins
  editor.use(area);
  area.use(reactRender);
  area.use(connection);

  // React render preset
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
  AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
    accumulating: AreaExtensions.accumulateSelection()
  });

  // Context menu state
  let contextMenuOpen = false;
  let contextMenuPos = { x: 0, y: 0 };
  let contextMenuItems: Array<{ label: string; onClick: () => void; key: string }> = [];

  // Context menu render function using React createPortal
  const contextMenuRoot = document.createElement('div');
  document.body.appendChild(contextMenuRoot);
  const contextMenuRootInstance = createRoot(contextMenuRoot);

  const renderContextMenu = () => {
    if (contextMenuOpen) {
      contextMenuRootInstance.render(
        <ContextMenu
          items={contextMenuItems}
          position={contextMenuPos}
          onClose={() => {
            contextMenuOpen = false;
            renderContextMenu();
          }}
        />
      );
    } else {
      contextMenuRootInstance.render(null);
    }
  };

  // Add context menu to nodes
  area.addPipe((context) => {
    if (context.type === 'nodepicked') {
      const nodeId = context.data.id;
      const position = area.nodeViews.get(nodeId)?.position || { x: 0, y: 0 };
      const nodeName = editor.getNode(nodeId)?.label;

      contextMenuOpen = true;
      contextMenuPos = {
        x: position.x + context.data.position.x,
        y: position.y + context.data.position.y
      };
      contextMenuItems = [
        {
          label: 'Delete node',
          key: 'delete',
          onClick: () => {
            editor.removeNode(nodeId);
          }
        },
        {
          label: 'Duplicate node',
          key: 'duplicate',
          onClick: async () => {
            const srcNode = editor.getNode(nodeId);
            if (srcNode) {
              const newNode = new Node(srcNode.label + ' (copy)');
              
              // Copy inputs/outputs
              for (const [key, input] of Object.entries(srcNode.inputs)) {
                newNode.addInput(key, new ClassicPreset.Input(socket));
              }
              for (const [key, output] of Object.entries(srcNode.outputs)) {
                newNode.addOutput(key, new ClassicPreset.Output(socket));
              }
              
              await editor.addNode(newNode);
              await area.translate(newNode.id, {
                x: position.x + 50,
                y: position.y + 50
              });
            }
          }
        },
        {
          label: 'Rename node',
          key: 'rename',
          onClick: () => {
            const node = editor.getNode(nodeId);
            if (node) {
              const newName = prompt('Enter new name', node.label);
              if (newName) {
                node.label = newName;
                area.update('node', nodeId);
              }
            }
          }
        },
        {
          label: 'Log node details',
          key: 'log',
          onClick: () => {
            console.log(editor.getNode(nodeId));
          }
        }
      ];
      renderContextMenu();
      return true;
    }
    return context;
  });

  // Add context menu for the background
  container.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    const position = area.area.pointer.position;
    const screenPosition = { x: e.clientX, y: e.clientY };
    
    contextMenuOpen = true;
    contextMenuPos = screenPosition;
    contextMenuItems = [
      {
        label: 'Add new node',
        key: 'add',
        onClick: async () => {
          const node = new Node('New Node');
          node.addInput('input', new ClassicPreset.Input(socket));
          node.addOutput('output', new ClassicPreset.Output(socket));
          
          await editor.addNode(node);
          await area.translate(node.id, position);
        }
      },
      {
        label: 'Arrange all nodes',
        key: 'arrange',
        onClick: () => {
          const nodes = editor.getNodes();
          let x = 0;
          let y = 0;
          
          nodes.forEach((node) => {
            area.translate(node.id, { x, y });
            x += 300;
            if (x > 900) {
              x = 0;
              y += 200;
            }
          });
        }
      },
      {
        label: 'Clear all nodes',
        key: 'clear',
        onClick: () => {
          if (confirm('Are you sure you want to remove all nodes?')) {
            editor.getNodes().forEach((node) => {
              editor.removeNode(node.id);
            });
          }
        }
      }
    ];
    renderContextMenu();
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
