# Rete.js Minimap Example

This example demonstrates how to implement a minimap in a Rete.js node editor, providing users with an overview of the entire node graph and quick navigation capabilities.

## Project Description

When working with large node graphs, it's easy to lose track of the overall structure and the current viewport's position within it. This example shows how to implement a minimap that provides a bird's-eye view of the entire node graph, allowing users to quickly navigate to different parts of the editor.

## Project Structure

```
├── public/        # Public assets
├── src/           # Source files
│   ├── App.tsx    # Main React component
│   ├── editor.ts  # Minimap implementation
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

- Compact overview of the entire node graph
- Current viewport indication
- Click-to-navigate functionality
- Draggable viewport indicator
- Real-time updates as nodes change
- Customizable appearance and position
- Responsive sizing and scaling

## Implementation

The example demonstrates how to:

1. Set up the minimap plugin
2. Position and style the minimap
3. Implement viewport indication and navigation
4. Synchronize the minimap with node graph changes
5. Handle user interactions with the minimap
6. Configure minimap appearance and behavior
7. Optimize performance for large graphs

## Learn More

For more information, visit [Rete.js Minimap Example](https://retejs.org/examples/minimap). 