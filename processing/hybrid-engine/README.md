# Hybrid Engine Example

This example demonstrates how to combine data-flow and control-flow engines in Rete.js v2, creating a hybrid processing system.

## Features

- Combining data-flow for value processing with control-flow for execution order
- Conditional execution paths
- Seed node with numeric input value
- Square node for mathematical operations
- If node for conditional branching

## How it works

1. The data-flow engine processes values between nodes
2. The control-flow engine determines the execution order and control flow
3. Nodes can interact with both paradigms simultaneously
4. Conditional logic can affect the execution path

## Structure

- `App.tsx` - Main application component
- `area.jsx` - Rete.js area setup
- `dataflow/engine.js` - Implementation of the data-flow engine
- `control-flow/engine.js` - Implementation of the control-flow engine
- `nodes.jsx` - Node definitions

## Original demo

[CodeSandbox Demo](https://codesandbox.io/p/sandbox/rete-js-v2-hybrid-engine-erkdtu)
