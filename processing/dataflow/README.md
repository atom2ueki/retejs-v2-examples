# Rete.js Dataflow Processing Example

This example showcases a data processing pipeline using `rete-engine`, where data flows from left to right through nodes.

Each node features a `data` method, which receives arrays of incoming data from their respective input sockets and delivers an object containing data corresponding to the output sockets. To initiate their execution, you can make use of the `engine.fetch` method by specifying the identifier of the target node. Consequently, the engine will execute all predecessors recursively, extracting their output data and delivering it to the specified node.

## Project Structure

```
├── public/        # Public assets
├── src/           # Source files
│   ├── App.tsx    # Main React component
│   ├── editor.ts  # Editor configuration
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

## Learn More

For more information, visit [Rete.js Dataflow Example](https://retejs.org/examples/processing/dataflow). 