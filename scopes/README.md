# Rete.js Scopes Example

This example demonstrates how to implement scope management in a Rete.js node editor, allowing for the organization of nodes into distinct contexts or workspaces.

## Project Description

Complex node-based applications often require organizing nodes into different scopes or contexts to maintain clarity and separation of concerns. This example shows how to implement a scope system that allows users to work with multiple node graphs within the same application, each within its own scope.

## Project Structure

```
├── public/        # Public assets
├── src/           # Source files
│   ├── App.tsx    # Main React component
│   ├── editor.ts  # Scopes implementation
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

- Multiple independent node workspaces
- Scope navigation and management
- Cross-scope connections
- Isolated execution contexts
- Visual differentiation between scopes
- Scope-specific settings and behaviors
- Hierarchical scope organization

## Implementation

The example demonstrates how to:

1. Create and manage multiple scopes
2. Navigate between different scopes
3. Maintain independent node collections for each scope
4. Implement cross-scope references and connections
5. Provide visual cues for distinguishing scopes
6. Handle scope-specific settings and behaviors
7. Organize scopes in hierarchical relationships

## Learn More

For more information, visit [Rete.js Scopes Example](https://retejs.org/examples/scopes). 