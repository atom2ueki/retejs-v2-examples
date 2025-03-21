# Rete.js Dock Example

This example demonstrates how to implement a docking system in a Rete.js node editor, allowing for organized panels and tools that can be positioned around the editor workspace.

## Project Description

A docking system provides a way to organize UI elements around the main editor area, giving users easy access to tools, node libraries, and property panels. This example shows how to implement dockable panels in Rete.js that can be positioned, resized, collapsed, and customized.

## Project Structure

```
├── public/        # Public assets
├── src/           # Source files
│   ├── App.tsx    # Main React component
│   ├── editor.ts  # Dock implementation
│   ├── dock/      # Dock components
│   ├── index.tsx  # Entry point
│   └── styles.css # Dock styling
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

- Dockable panels
- Multiple dock positions (left, right, top, bottom)
- Resizable dock areas
- Collapsible panels
- Drag-and-drop dock repositioning
- Customizable dock content
- Persistent dock configurations
- Responsive layout behavior

## Implementation

The example demonstrates how to:

1. Create a dock container system
2. Implement multiple dock positions around the editor
3. Add resize handles for adjusting dock sizes
4. Include collapse/expand functionality for space efficiency
5. Allow drag-and-drop reorganization of dock panels
6. Create custom dock content components
7. Save and restore dock configurations
8. Handle responsive layout changes for different screen sizes

## Learn More

For more information, visit [Rete.js Dock Example](https://retejs.org/examples/dock). 