# Rete.js Hybrid Engine Processing Example

This example demonstrates a hybrid approach that integrates both dataflow and control flow processing within a single node editor. It showcases how to combine these two paradigms to create more powerful and flexible node-based applications.

The hybrid engine supports both execution-based processing (control flow) and data transformation (dataflow) simultaneously. This allows nodes to both process data and control the execution flow of the application.

## Project Structure

```
├── public/        # Public assets
├── src/           # Source files
│   ├── App.tsx    # Main React component with execution log
│   ├── editor.ts  # Editor configuration with hybrid node definitions
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

For more information, visit [Rete.js Hybrid Engine Example](https://retejs.org/examples/processing/hybrid-engine). 