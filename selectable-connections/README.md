# Rete.js Selectable Connections Example

This example demonstrates how to implement selectable connections in a Rete.js node editor, allowing users to interact with and modify connections directly.

## Project Description

Most node editors treat connections as passive links between nodes, but making connections selectable adds powerful interaction capabilities. This example shows how to implement selectable connections, enabling users to select, delete, modify, or get information about connections directly.

## Project Structure

```
├── public/        # Public assets
├── src/           # Source files
│   ├── App.tsx    # Main React component
│   ├── editor.ts  # Selectable connections implementation
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

- Select connections with mouse clicks
- Visual feedback for selected connections
- Delete connections directly
- Multi-selection support for connections
- Connection information display
- Connection styling customization
- Interaction with selected connections

## Implementation

The example demonstrates how to:

1. Make connections interactive by adding selection capabilities
2. Provide visual feedback for selected connections
3. Implement keyboard shortcuts for managing connections
4. Add context menu options for connection operations
5. Combine node and connection selection
6. Handle multi-selection of different element types
7. Create custom actions for selected connections

## Learn More

For more information, visit [Rete.js Selectable Connections Example](https://retejs.org/examples/selectable-connections). 