# Rete.js Modules Example

This example demonstrates how to implement modular components in a Rete.js node editor, allowing for the creation of reusable node groups that can be collapsed and expanded.

## Project Description

As node graphs grow in complexity, organizing related nodes into modules becomes essential for maintainability. This example shows how to implement a module system that allows users to group related nodes into collapsible modules, reducing visual clutter and improving workflow organization.

## Project Structure

```
├── public/        # Public assets
├── src/           # Source files
│   ├── App.tsx    # Main React component
│   ├── editor.ts  # Modules implementation
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

- Create modules from selected nodes
- Collapse and expand modules
- Input/output port management
- Nested module support
- Visual representation of module state
- External connections between modules
- Module editing and customization

## Implementation

The example demonstrates how to:

1. Convert a selection of nodes into a module
2. Manage input and output ports for modules
3. Handle connections between modules and regular nodes
4. Implement collapse and expand functionality
5. Navigate into modules for editing
6. Create nested module hierarchies
7. Maintain data flow through modules

## Learn More

For more information, visit [Rete.js Modules Example](https://retejs.org/examples/modules). 