# Rete.js Smooth Zoom Example

This example demonstrates how to implement smooth zooming and panning functionality in a Rete.js node editor, enhancing the user experience when navigating complex node graphs.

## Project Description

As node graphs grow in complexity, efficient navigation becomes crucial. This example shows how to implement fluid, animation-based zooming and panning to provide a more intuitive and user-friendly navigation experience when working with large node networks.

## Project Structure

```
├── public/        # Public assets
├── src/           # Source files
│   ├── App.tsx    # Main React component
│   ├── editor.ts  # Smooth zoom implementation
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

- Smooth animated zooming
- Intuitive panning behavior
- Focus-point based zooming
- Mouse wheel and gesture support
- Zoom limits and constraints
- Programmatic zoom/pan controls
- Transition animations

## Implementation

The example demonstrates how to:

1. Implement smooth transitions between zoom levels
2. Add mouse wheel and gesture-based zoom controls
3. Set up focus-point zooming (zooming toward cursor position)
4. Create programmatic zoom and pan functions
5. Configure zoom boundaries and constraints
6. Handle different input methods (mouse, touch, keyboard)

## Learn More

For more information, visit [Rete.js Smooth Zoom Example](https://retejs.org/examples/smooth-zoom). 