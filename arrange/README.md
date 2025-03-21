# Rete.js Arrange Nodes Example

This example demonstrates how to automatically arrange nodes in a Rete.js editor using the auto-arrange plugin, providing a clean and organized layout for complex node graphs.

## Project Description

When working with complex node networks, manual arrangement can become tedious and result in cluttered layouts. This example shows how to implement automatic node arrangement to create visually clean and logically organized node graphs with minimal user effort.

## Project Structure

```
├── public/        # Public assets
├── src/           # Source files
│   ├── App.tsx    # Main React component
│   ├── editor.ts  # Auto-arrange implementation
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

- Automatic node layout arrangement
- Graph visualization optimizations
- Integration with ELK layout algorithm
- Configurable layout options
- Arrangement triggers (manual and automatic)
- Visual transition animations

## Implementation

The example uses the `rete-auto-arrange-plugin` with the ELK layout engine to calculate optimal node positions based on their connections and hierarchical relationships. The implementation demonstrates how to:

1. Initialize the auto-arrange plugin
2. Configure layout parameters
3. Trigger arrangements programmatically or via user interaction
4. Animate the transition to new layouts

## Learn More

For more information, visit [Rete.js Arrange Nodes Example](https://retejs.org/examples/arrange). 