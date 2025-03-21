import { createRoot } from 'react-dom/client'
import { createEditor, NodeEditor } from 'rete'
import { AreaPlugin, AreaExtensions } from 'rete-area-plugin'
import { ReactPlugin, Presets as ReactPresets, ReactArea2D } from 'rete-react-plugin'
import { ConnectionPlugin, Presets as ConnectionPresets } from 'rete-connection-plugin'
import { useState, useEffect } from 'react'

import './styles.css'

// Custom node component
function Node(props: { data: any }) {
  return (
    <div className={`node ${props.data.type || ''}`}>
      <div className="node-header">{props.data.label}</div>
    </div>
  )
}

// Create editor with plugins
class EditorSetup {
  editor: NodeEditor
  area: ReturnType<typeof AreaPlugin.reaction> | null = null
  magneticDistance = 80

  async setup(container: HTMLElement) {
    // Create editor
    const editor = createEditor()
    this.editor = editor

    // Area plugin for node rendering
    const area = new AreaPlugin<ReactArea2D>(container)
    this.area = area

    // Register plugins
    const connection = new ConnectionPlugin<ReactArea2D>()
    const render = new ReactPlugin<ReactArea2D>()

    // Add plugins to editor
    editor.use(area)
    area.use(connection)
    area.use(render)

    // Configure rendering
    render.addPreset(ReactPresets.classic.setup({ customize: { node: () => Node } }))

    // Setup connections with custom logic
    connection.addPreset(ConnectionPresets.classic.setup())

    // Implement magnetic connections
    area.addPipe(context => {
      if (context.type === 'nodetranslate') {
        const { nodeId, position } = context.data;
        const movingNode = editor.getNode(nodeId);
        
        if (movingNode) {
          // Find all other nodes to check for magnetic attraction
          const otherNodes = editor.getNodes().filter(node => node.id !== nodeId);
          
          // Initialize closest variables
          let closestDistance = this.magneticDistance;
          let closestNode = null;
          let alignX = false;
          let alignY = false;
          
          // Check all other nodes
          for (const otherNode of otherNodes) {
            // Check horizontal alignment (Y-axis is close)
            const yDiff = Math.abs(position.y - otherNode.position.y);
            
            if (yDiff < closestDistance) {
              const xDiff = Math.abs(position.x - otherNode.position.x);
              
              // If nodes are not too far horizontally
              if (xDiff < 300) {
                closestDistance = yDiff;
                closestNode = otherNode;
                alignX = false;
                alignY = true;
              }
            }
            
            // Check vertical alignment (X-axis is close)
            const xDiff = Math.abs(position.x - otherNode.position.x);
            
            if (xDiff < closestDistance) {
              const yDiff = Math.abs(position.y - otherNode.position.y);
              
              // If nodes are not too far vertically
              if (yDiff < 300) {
                closestDistance = xDiff;
                closestNode = otherNode;
                alignX = true;
                alignY = false;
              }
            }
          }
          
          // If we found a node to align with
          if (closestNode) {
            if (alignY) {
              // Align Y position with the closest node
              context.data.position = { 
                x: position.x, 
                y: closestNode.position.y 
              };
            } else if (alignX) {
              // Align X position with the closest node
              context.data.position = { 
                x: closestNode.position.x, 
                y: position.y 
              };
            }
          }
        }
      }
      return context;
    });

    // Add zoom/pan controls
    AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
      accumulating: AreaExtensions.accumulateOnCtrl()
    })
    AreaExtensions.simpleNodesOrder(area)
    AreaExtensions.showInputControl(area)

    // Add initial nodes
    await editor.addNode({
      id: 'node-1',
      label: 'Node 1',
      position: { x: 100, y: 100 }
    })

    await editor.addNode({
      id: 'node-2',
      label: 'Node 2',
      position: { x: 300, y: 300 }
    })

    await editor.addNode({
      id: 'node-3',
      label: 'Node 3',
      position: { x: 500, y: 100 }
    })

    await editor.addNode({
      id: 'node-4',
      label: 'Node 4',
      position: { x: 500, y: 300 }
    })

    return {
      destroy: () => {
        editor.destroy()
      },
    }
  }

  addNode() {
    if (!this.editor) return
    
    // Generate a unique ID for the new node
    const id = `node-${Date.now()}`
    
    // Calculate a random position within the visible area
    const x = Math.random() * 600 + 50
    const y = Math.random() * 400 + 50
    
    // Create and add the new node
    this.editor.addNode({
      id,
      label: `Node ${this.editor.getNodes().length + 1}`,
      position: { x, y }
    })
  }

  setMagneticDistance(distance: number) {
    this.magneticDistance = distance
  }
}

// Create React app component
export default function App() {
  const [editorSetup] = useState(() => new EditorSetup())
  const [mounted, setMounted] = useState(false)
  const [magneticDistance, setMagneticDistance] = useState(80)

  useEffect(() => {
    if (!mounted) {
      const container = document.querySelector('.editor') as HTMLElement
      editorSetup.setup(container)
      setMounted(true)
    }
  }, [mounted, editorSetup])

  const handleAddNode = () => {
    editorSetup.addNode()
  }

  const handleDistanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)
    setMagneticDistance(value)
    editorSetup.setMagneticDistance(value)
  }

  return (
    <div className="App">
      <div className="header">
        <h3>Rete.js v2 - Magnetic Connection Example</h3>
        <div className="controls">
          <div className="control-group">
            <label>Magnetic Distance: {magneticDistance}px</label>
            <input 
              type="range" 
              min="0" 
              max="200" 
              value={magneticDistance} 
              onChange={handleDistanceChange} 
            />
          </div>
          <button onClick={handleAddNode}>Add Node</button>
        </div>
      </div>
      <div className="instructions">
        <p>Drag nodes to see magnetic alignment in action. Nodes will align horizontally or vertically when close to each other.</p>
      </div>
      <div className="editor"></div>
    </div>
  )
}

// Render app
const root = createRoot(document.getElementById('root')!)
root.render(<App />)
