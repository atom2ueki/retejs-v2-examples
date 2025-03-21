# Rete.js Processing Examples with React

This directory contains three different approaches to processing in Rete.js, each implemented using React.js and demonstrating unique capabilities and use cases.

## Processing Approaches

### 1. Dataflow Processing
Located in `dataflow/` directory, this example demonstrates the classic dataflow processing approach where data flows from left to right through nodes. Each node has a `data` method that receives arrays of incoming data from input sockets and delivers an object containing data corresponding to output sockets. The engine executes nodes recursively, extracting output data and delivering it to subsequent nodes.

### 2. Control Flow Processing
Located in `control-flow/` directory, this React-based example shows how to implement control flow logic in your node editor. Each node has an `execute` method that receives an input port key as a control source and a function for forwarding control to outgoing nodes. The engine initiates execution at a specified starting node, and the flow proceeds sequentially through connected nodes.

### 3. Hybrid Engine Processing
Located in `hybrid-engine/` directory, this example combines both dataflow and control flow approaches using React.js. It demonstrates how certain nodes can serve as data sources, others can manage execution flow, and some can incorporate both approaches, creating a more powerful and flexible node-based system.

## Implementation

Each example uses the `rete-engine` package with the appropriate engine implementation:
- Dataflow: `DataflowEngine`
- Control Flow: `ControlFlowEngine`
- Hybrid Engine: Both engines working together

## Getting Started

Each subdirectory contains its own README.md with specific instructions for running and understanding that particular processing approach.

## Learn More

For more information about Rete.js processing concepts, visit [Rete.js Engine Documentation](https://retejs.org/docs/concepts/engine/). 