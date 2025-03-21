import { createRoot } from 'react-dom/client'
import { createEditor, Editor, NodeEditor } from 'rete'
import { AreaPlugin, AreaExtensions } from 'rete-area-plugin'
import { ReactPlugin, Presets, ReactArea2D } from 'rete-react-plugin'
import { ConnectionPlugin, Presets as ConnectionPresets } from 'rete-connection-plugin'
import { useState, useEffect } from 'react'

import './styles.css'

// Custom node component
function Node(props: { data: any }) {
  return (
    <div className="node">
      <div className="node-header">{props.data.label}</div>
    </div>
  )
}

// Create editor with plugins
class EditorSetup {
  editor: NodeEditor
  area: ReturnType<typeof AreaPlugin.reaction> | null = null
  connection: ConnectionPlugin<ReactArea2D> | null = null

  async setup(container: HTMLElement) {
    // Create editor
    const editor = createEditor()
    this.editor = editor

    // Area plugin for node rendering
    const area = new AreaPlugin<ReactArea2D>(container)
    this.area = area

    // Register plugins
    const connection = new ConnectionPlugin<ReactArea2D>()
    this.connection = connection
    const render = new ReactPlugin<ReactArea2D>()

    // Add plugins to editor
    editor.use(area)
    area.use(connection)
    area.use(render)

    // Configure rendering
    render.addPreset(Presets.classic.setup({ customize: { node: () => Node } }))

    // Setup connections
    connection.addPreset(ConnectionPresets.classic.setup())

    // Add zoom/pan controls
    AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
      accumulating: AreaExtensions.accumulateOnCtrl()
    })
    AreaExtensions.simpleNodesOrder(area)
    AreaExtensions.showInputControl(area)

    // Handle connection created event
    connection.addPipe(context => {
      if (context.type === 'connectioncreate') {
        // When a new connection is created, add it to the editor
        if (context.data) {
          editor.addConnection(context.data)
        }
      }
      return context
    })

    // Add option to insert node into a connection
    editor.addPipe(context => {
      if (context.type === 'connectionpick') {
        setTimeout(() => {
          if (confirm('Insert a new node into this connection?')) {
            this.insertNode(context.data.id)
          }
        }, 100)
      }
      return context
    })

    // Add initial nodes
    // Node 1 (Source)
    const node1 = await editor.addNode({
      id: 'node-1',
      label: 'Source Node'
    })
    node1.position = { x: 50, y: 100 }

    // Node 2 (Target)
    const node2 = await editor.addNode({
      id: 'node-2',
      label: 'Target Node'
    })
    node2.position = { x: 350, y: 100 }

    // Connect nodes
    await editor.addConnection({
      id: 'connection-1',
      source: 'node-1',
      target: 'node-2',
      sourceOutput: 'output',
      targetInput: 'input'
    })

    return {
      destroy: () => {
        editor.destroy()
      },
    }
  }

  async insertNode(connectionId: string) {
    if (!this.editor || !this.area) return
    
    try {
      // Get the connection
      const connection = this.editor.getConnection(connectionId)
      if (!connection) return
      
      // Create a new node
      const newNodeId = `inserted-node-${Date.now()}`
      const newNode = await this.editor.addNode({
        id: newNodeId,
        label: 'Inserted Node'
      })
      
      // Get source and target node positions to calculate middle position
      const sourceNode = this.editor.getNode(connection.source)
      const targetNode = this.editor.getNode(connection.target)
      
      if (sourceNode && targetNode) {
        // Calculate middle position
        const middleX = (sourceNode.position.x + targetNode.position.x) / 2
        const middleY = (sourceNode.position.y + targetNode.position.y) / 2
        
        // Set new node position
        newNode.position = { x: middleX, y: middleY }
        
        // Remove the original connection
        await this.editor.removeConnection(connectionId)
        
        // Create two new connections
        await this.editor.addConnection({
          source: connection.source,
          target: newNodeId,
          sourceOutput: connection.sourceOutput,
          targetInput: 'input'
        })
        
        await this.editor.addConnection({
          source: newNodeId,
          target: connection.target,
          sourceOutput: 'output',
          targetInput: connection.targetInput
        })
      }
    } catch (error) {
      console.error('Error inserting node:', error)
    }
  }

  async createNewConnection() {
    // Manually create a new connection for demonstration
    if (!this.editor) return

    try {
      const nodes = this.editor.getNodes()
      if (nodes.length < 2) return

      // Find nodes without connections for this demo
      const availableNodes = nodes.filter(node => 
        node.id !== 'node-1' && node.id !== 'node-2' && !node.id.includes('inserted')
      )

      if (availableNodes.length < 2) {
        // If not enough disconnected nodes, create new ones
        const newSourceId = `node-${Date.now()}-a`
        const newTargetId = `node-${Date.now()}-b`
        
        const sourceNode = await this.editor.addNode({
          id: newSourceId,
          label: 'New Source'
        })
        sourceNode.position = { x: 50, y: 300 }
        
        const targetNode = await this.editor.addNode({
          id: newTargetId,
          label: 'New Target'
        })
        targetNode.position = { x: 350, y: 300 }
        
        // Create connection between new nodes
        await this.editor.addConnection({
          id: `connection-${Date.now()}`,
          source: newSourceId,
          target: newTargetId,
          sourceOutput: 'output',
          targetInput: 'input'
        })
      } else {
        // Create connection between available nodes
        await this.editor.addConnection({
          id: `connection-${Date.now()}`,
          source: availableNodes[0].id,
          target: availableNodes[1].id,
          sourceOutput: 'output',
          targetInput: 'input'
        })
      }
    } catch (error) {
      console.error('Error creating connection:', error)
    }
  }
}

// Create React app component
export default function App() {
  const [editorSetup] = useState(() => new EditorSetup())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (!mounted) {
      const container = document.querySelector('.editor') as HTMLElement
      editorSetup.setup(container)
      setMounted(true)
    }
  }, [mounted, editorSetup])

  const handleAddConnection = () => {
    editorSetup.createNewConnection()
  }

  return (
    <div className="App">
      <div className="header">
        <h3>Rete.js v2 - Insert Node Between Nodes Example</h3>
        <div className="instructions">
          <p>Click on a connection line and confirm to insert a new node</p>
          <button onClick={handleAddConnection}>Add New Connection</button>
        </div>
      </div>
      <div className="editor"></div>
    </div>
  )
}

// Render app
const root = createRoot(document.getElementById('root')!)
root.render(<App />)
