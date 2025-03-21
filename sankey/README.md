# Rete.js Sankey Example

This example demonstrates how to implement Sankey diagram visualization in a Rete.js node editor, allowing users to visualize flows and quantities between connected nodes.

## Project Description

Sankey diagrams are flow diagrams where the width of the connections represents the quantity or magnitude of the flow between nodes. This example shows how to implement Sankey-style connections in a Rete.js editor, providing an intuitive visualization of flow magnitudes in data processing networks.

## Project Structure

```
├── public/        # Public assets
├── src/           # Source files
│   ├── App.tsx    # Main React component
│   ├── editor.ts  # Sankey implementation
│   ├── sankey/    # Sankey diagram components
│   ├── index.tsx  # Entry point
│   └── styles.css # Sankey styling
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

- Flow magnitude visualization
- Proportional connection widths
- Color-coded flow paths
- Flow aggregation at nodes
- Dynamic flow updates
- Interactive flow inspection
- Custom flow rendering
- Data-driven connection styling

## Implementation

The example demonstrates how to:

1. Create custom connection renderers for Sankey visualization
2. Calculate connection widths based on flow magnitude
3. Implement color mapping for different flow types
4. Handle flow splitting and merging at nodes
5. Update connection visuals when flow values change
6. Add interaction for inspecting flow details
7. Optimize rendering for complex flow networks
8. Implement smooth transitions for changing flows

## Learn More

For more information, visit [Rete.js Sankey Example](https://retejs.org/examples/sankey). 