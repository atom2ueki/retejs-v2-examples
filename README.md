<p align="center">
  <img width="300" src="https://github.com/retejs.png" alt="Rete.js logo">
</p>

# Rete.js Examples V2

This repository contains various React-based examples demonstrating the capabilities of Rete.js v2. Each example showcases different features and implementations using React.js, providing practical implementations that can be used as reference for your own projects.

## Getting Started

Each example is a standalone React application with its own package.json and can be run independently:

```bash
# Navigate to an example directory
cd example-name

# Install dependencies
npm install

# Start the development server
npm start
```

The application will be available at http://localhost:3000.

## Example Categories

### Core Examples

| Example | Description |
|---------|-------------|
| [Basic](./basic/) | Fundamental example demonstrating core Rete.js functionality, including basic node creation, connections, and event handling. |
| [Controls](./controls/) | Implementation of custom UI controls within nodes, including text inputs, sliders, and other interactive elements. |
| [Customization](./customization/) | Advanced UI customization including custom node designs, socket styles, connection appearances, and background effects. |

### User Interface

| Example | Description |
|---------|-------------|
| [Context Menu](./context-menu/) | Implementation of context-sensitive menus for quick access to actions. |
| [Dock](./dock/) | Docking system for organizing UI panels around the editor workspace. |
| [Dock Menu](./dock-menu/) | Customizable panel for organizing node types and tools for easy access. |
| [Minimap](./minimap/) | Bird's-eye view navigator for large node graphs. |
| [Comments](./comments/) | Resizable and draggable comment boxes for documenting node graphs. |

### Navigation & Layout

| Example | Description |
|---------|-------------|
| [Arrange](./arrange/) | Automatic node arrangement for clean graph layouts. |
| [Smooth Zoom](./smooth-zoom/) | Smooth animated zooming and panning functionality. |
| [Panning Boundary](./panning-boundary/) | Constraints to limit the editor's panning area. |
| [Modules](./modules/) | Implementation of collapsible module nodes containing sub-graphs. |
| [Scopes](./scopes/) | Management of multiple independent node workspaces. |

### Connection Management

| Example | Description |
|---------|-------------|
| [Magnetic Connection](./magnetic-connection/) | Magnetic alignment for connections between nodes. |
| [Selectable Connections](./selectable-connections/) | Ability to select and manipulate connections. |
| [Connection Path](./connection-path/) | Custom path styles for connections between nodes. |
| [Insert Node](./insert-node/) | Adding nodes between existing connections. |
| [Reroute](./reroute/) | Connection waypoints for organizing complex graphs. |

### Visualization & Data Flow

| Example | Description |
|---------|-------------|
| [Sankey](./sankey/) | Flow visualization with proportional connection widths. |
| [Processing](./processing/) | Multiple approaches to data processing (Dataflow, Control Flow, Hybrid Engine). |
| [Performance](./performance/) | Optimization techniques for large node graphs. |
| [Readonly](./readonly/) | Read-only mode implementation for viewing without editing. |

### Advanced Features

| Example | Description |
|---------|-------------|
| [Area Extensions](./area-extensions/) | Custom extensions to enhance editor functionality. |
| [History](./history/) | Undo/redo functionality for node graph operations. |
| [Chatbot](./chatbot/) | Node-based chatbot workflow editor implementation. |
| [Nested Engine](./nested-engine/) | Hierarchical computation with nodes containing sub-graphs. |

## Practical Uses

Rete.js can be used to build a variety of visual programming and diagramming tools:

- Visual programming environments
- Data flow systems
- Workflow designers
- Business process modeling
- Logic circuit simulators
- Game behavior trees
- AI/ML model builders
- ETL (Extract, Transform, Load) tools
- IoT device programming
- API workflow designers

## Source References

All examples are based on the official Rete.js examples from [retejs.org](https://retejs.org/examples) and adapted for React.js implementation.

## Contributing

Contributions to improve examples or add new ones are welcome. Please ensure any new examples follow the established structure and include proper documentation.

## License

Released under the MIT License

Copyright © 2018-2024 Vitaliy Stoliarov