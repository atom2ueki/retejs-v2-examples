# Rete.js Performance Example

This example demonstrates performance optimization techniques for Rete.js when working with a large number of nodes. It allows you to set the number of nodes to be displayed and assess rendering performance in real-time.

## Project Description

Visualizing a large number of elements on a page inevitably comes with performance challenges. This example provides a testbed for evaluating rendering performance with different node quantities, helping you understand the performance implications of your node editor implementation.

## Project Structure

```
├── public/        # Public assets
├── src/           # Source files
│   ├── App.tsx    # Main React component with node quantity controls
│   ├── editor.ts  # Performance-optimized editor configuration
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

- Dynamic node generation for performance testing
- Real-time performance metrics
- Configurable node quantity
- Optimized rendering techniques
- Performance comparison tools

## Related Examples

For handling even larger node quantities, consider exploring specialized approaches:
- LOD (Level of Detail) example
- LOD GPU example

These approaches can help mitigate the performance limitations when working with very large node graphs.

## Learn More

For more information, visit [Rete.js Performance Example](https://retejs.org/examples/performance). 