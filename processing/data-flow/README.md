# Data-flow Engine Example

This example demonstrates how to use Rete.js v2 with a data-flow engine. The data-flow paradigm allows nodes to process data and pass it to connected nodes.

## Features

- Basic number input nodes
- Add operation node
- Data flow processing
- React-based UI

## How it works

1. The data flows from source nodes (number inputs) to processing nodes (add node)
2. Each node can process the input data and produce output data
3. The output is automatically passed to connected nodes
4. The UI updates reactively as values change

## Structure

- `App.tsx` - Main application component
- `area.jsx` - Rete.js area setup
- `dataflow-engine.js` - Implementation of the data-flow engine
- `nodes.jsx` - Node definitions

## Original demo

[CodeSandbox Demo](https://codesandbox.io/p/sandbox/rete-js-v2-dataflow-engine-tyhr1e)
