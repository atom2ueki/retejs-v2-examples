# Rete.js Readonly Example

This example demonstrates how to implement a readonly mode in a Rete.js node editor, allowing users to view but not modify a node graph.

## Project Description

There are many scenarios where you want to display a node graph for visualization or educational purposes without allowing modifications. This example shows how to implement a readonly mode that disables editing capabilities while still allowing users to navigate and explore the node graph.

## Project Structure

```
├── public/        # Public assets
├── src/           # Source files
│   ├── App.tsx    # Main React component with toggle controls
│   ├── editor.ts  # Readonly mode implementation
│   ├── index.tsx  # Entry point
│   └── styles.css # Basic styling
├── package.json   # Project dependencies
└── tsconfig.json  # TypeScript configuration
```

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm start
```

The application will be available at http://localhost:3000.

## Features

- Toggle between edit and readonly modes
- Visual indication of readonly state
- Selective permission controls
- Preservation of navigation capabilities
- Customizable readonly behavior
- Per-node readonly options
- Access control patterns

## Implementation

The example demonstrates how to:

1. Use the readonly plugin to disable editing capabilities
2. Configure which interactions remain enabled in readonly mode
3. Provide visual feedback to indicate the current mode
4. Implement a toggle control for switching between modes
5. Apply readonly state selectively to specific nodes or areas
6. Maintain navigation capabilities while preventing edits

## Learn More

For more information, visit [Rete.js Readonly Example](https://retejs.org/examples/readonly). 