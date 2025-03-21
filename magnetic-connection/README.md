# Rete.js Magnetic Connection Example

This example demonstrates how to implement magnetic connections in Rete.js, which helps align nodes when dragging to create more visually organized node graphs.

## Project Description

When working with node editors, maintaining a clean layout can be challenging as the number of nodes increases. Magnetic connections provide automatic alignment suggestions while dragging nodes, helping users create more structured and readable node arrangements with minimal effort.

## Project Structure

```
├── public/        # Public assets
├── src/           # Source files
│   ├── App.tsx    # Main React component
│   ├── editor.ts  # Magnetic connection implementation
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

- Magnetic alignment when dragging nodes
- Visual guide indicators for alignment
- Automatic snapping to grid or other nodes
- Customizable alignment thresholds
- Smooth animation effects
- Cross-axis and same-axis alignment detection

## Implementation

The example demonstrates how to:

1. Detect potential alignment opportunities while dragging
2. Implement visual indicators for alignment guides
3. Apply snapping behavior with customizable thresholds
4. Provide smooth transitions between positions
5. Allow toggling of the feature for user preference

## Learn More

For more information, visit [Rete.js Magnetic Connection Example](https://retejs.org/examples/magnetic-connection). 