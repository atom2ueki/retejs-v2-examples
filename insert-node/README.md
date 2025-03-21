# Rete.js Insert Node Example

This example demonstrates how to implement functionality for inserting a new node between two connected nodes in a Rete.js editor, enhancing the workflow for modifying existing node graphs.

## Project Description

When working with node-based editors, the ability to insert new nodes between existing connections is a powerful feature for iterative development. This example shows how to implement this functionality, automatically reconnecting inputs and outputs to maintain the flow while adding new processing steps.

## Project Structure

```
├── public/        # Public assets
├── src/           # Source files
│   ├── App.tsx    # Main React component
│   ├── editor.ts  # Node insertion implementation
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

- Insert nodes between existing connections
- Automatic reconnection of inputs and outputs
- Connection path visualization
- Context menu integration
- User-friendly interaction pattern
- Preservation of existing data flow

## Implementation

The example demonstrates how to:

1. Detect when a node should be inserted on a connection
2. Create the new node at the appropriate position
3. Remove the original connection
4. Create new connections that link the source to the new node and the new node to the target
5. Handle socket compatibility checks
6. Provide visual feedback during the operation

## Learn More

For more information, visit [Rete.js Insert Node Example](https://retejs.org/examples/insert-node). 