# Rete.js Control Flow Processing Example

This example demonstrates the implementation of a control flow using the `rete-engine`, which enables nodes to be executed sequentially based on user-defined connections.

Each node features an `execute` method that receives input data and a `forward` function, which is used to trigger execution of connected nodes. By invoking the `engine.execute` method with the ID of the starting node, the engine will initiate the execution sequence, traversing through nodes following their connections.

## Project Structure

```
├── public/        # Public assets
├── src/           # Source files
│   ├── App.tsx    # Main React component with execution log
│   ├── editor.ts  # Editor configuration
│   ├── index.tsx  # Entry point
│   └── styles.css # Basic styling with log panel
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

## Learn More

For more information, visit [Rete.js Control Flow Example](https://retejs.org/examples/processing/control-flow). 