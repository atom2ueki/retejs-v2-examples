# Rete.js History Example

This example demonstrates how to implement undo and redo functionality in a Rete.js node editor, allowing users to track and revert changes to the node graph.

## Project Description

History tracking is an essential feature for any editor application. This example shows how to implement an undo/redo system in Rete.js that captures node and connection additions, deletions, and modifications, enabling users to explore different versions of their node graph without fear of losing work.

## Project Structure

```
├── public/        # Public assets
├── src/           # Source files
│   ├── App.tsx    # Main React component
│   ├── editor.ts  # History implementation
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

- Undo/redo functionality
- History state management
- Keyboard shortcuts (Ctrl+Z, Ctrl+Y)
- State change tracking
- Transaction grouping
- Modification snapshots
- History navigation UI

## Implementation

The example demonstrates how to:

1. Track node and connection changes
2. Implement the history stack data structure
3. Create atomic history operations
4. Group related operations into transactions
5. Handle keyboard shortcuts for undo/redo
6. Build a user interface for history navigation
7. Optimize memory usage for large history stacks
8. Ensure consistent state restoration

## Learn More

For more information, visit [Rete.js History Example](https://retejs.org/examples/history). 