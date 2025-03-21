import { createRoot } from 'react-dom/client'
import { createEditor, Editor, NodeEditor } from 'rete'
import { AreaPlugin, AreaExtensions } from 'rete-area-plugin'
import { ReactPlugin, Presets, ReactArea2D } from 'rete-react-plugin'
import { ConnectionPlugin, Presets as ConnectionPresets } from 'rete-connection-plugin'
import { ArrangePlugin, Presets as ArrangePresets } from 'rete-arrange-plugin'
import { AutoArrangePlugin } from 'rete-auto-arrange-plugin'
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
  arrange: ArrangePlugin | null = null
  autoArrange: AutoArrangePlugin | null = null

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
    this.arrange = new ArrangePlugin<ReactArea2D>()
    this.autoArrange = new AutoArrangePlugin<ReactArea2D>()

    // Add plugins to editor
    editor.use(area)
    area.use(connection)
    area.use(render)
    area.use(this.arrange)
    area.use(this.autoArrange)

    // Configure rendering
    render.addPreset(Presets.classic.setup({ customize: { node: () => Node } }))

    // Setup connections
    connection.addPreset(ConnectionPresets.classic.setup())

    // Configure arrangement
    this.arrange.addPreset(ArrangePresets.classic.setup())

    // Add zoom/pan controls
    AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
      accumulating: AreaExtensions.accumulateOnCtrl()
    })
    AreaExtensions.simpleNodesOrder(area)
    AreaExtensions.showInputControl(area)

    // Add nodes
    // Node 1
    const node1 = await editor.addNode({
      id: 'node-1',
      label: 'Node 1'
    })
    node1.position = { x: 0, y: 0 }

    // Node 2
    const node2 = await editor.addNode({
      id: 'node-2',
      label: 'Node 2'
    })
    node2.position = { x: 250, y: 100 }

    // Node 3
    const node3 = await editor.addNode({
      id: 'node-3',
      label: 'Node 3'
    })
    node3.position = { x: 100, y: 200 }

    // Node 4
    const node4 = await editor.addNode({
      id: 'node-4',
      label: 'Node 4'
    })
    node4.position = { x: 350, y: 250 }

    // Connect nodes
    await editor.addConnection({
      source: 'node-1',
      target: 'node-2',
      sourceOutput: 'output',
      targetInput: 'input'
    })

    await editor.addConnection({
      source: 'node-1',
      target: 'node-3',
      sourceOutput: 'output',
      targetInput: 'input'
    })

    await editor.addConnection({
      source: 'node-2',
      target: 'node-4',
      sourceOutput: 'output',
      targetInput: 'input'
    })

    await editor.addConnection({
      source: 'node-3',
      target: 'node-4',
      sourceOutput: 'output',
      targetInput: 'input'
    })

    return {
      destroy: () => {
        editor.destroy()
      },
    }
  }

  arrangeNodes() {
    if (this.arrange) {
      // Arrange using the arrange plugin
      this.arrange.layout({ options: { 'elk.spacing.nodeNode': 80 } });
    }
  }

  autoArrangeNodes() {
    if (this.autoArrange) {
      // Auto arrange using the auto-arrange plugin
      this.autoArrange.layout();
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

  const handleArrangeClick = () => {
    editorSetup.arrangeNodes()
  }

  const handleAutoArrangeClick = () => {
    editorSetup.autoArrangeNodes()
  }

  return (
    <div className="App">
      <div className="header">
        <h3>Rete.js v2 - Node Arrangement Example</h3>
        <div className="buttons">
          <button onClick={handleArrangeClick}>Arrange Nodes</button>
          <button onClick={handleAutoArrangeClick}>Auto Arrange</button>
        </div>
      </div>
      <div className="editor"></div>
    </div>
  )
}

// Render app
const root = createRoot(document.getElementById('root')!)
root.render(<App />)
