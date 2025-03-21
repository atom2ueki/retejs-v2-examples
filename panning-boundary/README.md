# Rete.js Panning Boundary Example

This example demonstrates how to implement panning boundaries in a Rete.js node editor, restricting how far users can navigate away from the node graph to prevent getting lost in empty space.

## Project Description

When working with large node editors, it's easy for users to pan too far and lose sight of their work. This example shows how to implement boundaries that limit how far users can pan in any direction, ensuring they always stay within a reasonable distance of the node graph.

## Project Structure

```
├── public/        # Public assets
├── src/           # Source files
│   ├── App.tsx    # Main React component
│   ├── editor.ts  # Panning boundary implementation
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

- Configurable panning boundaries
- Visual indication of boundaries
- Dynamic boundary adjustment
- Smooth restriction behavior
- Content-aware boundaries
- Customizable margin settings
- Override controls for special cases

## Implementation

The example demonstrates how to:

1. Define maximum panning boundaries
2. Implement restriction logic for panning operations
3. Provide visual feedback when boundaries are reached
4. Adjust boundaries based on content size
5. Configure different boundary behaviors
6. Allow temporary boundary overrides when needed

## Learn More

For more information, visit [Rete.js Panning Boundary Example](https://retejs.org/examples/panning-boundary). 