# Rete.js Context Menu Example

This example demonstrates how to implement a context menu in a Rete.js node editor, providing quick access to actions and node creation tools.

## Project Description

Context menus are a crucial part of any interactive editor, offering convenient access to relevant actions based on where the user clicks. This example shows how to implement a customizable context menu system in Rete.js that provides different options depending on whether the user clicks on the background, a node, or a connection.

## Project Structure

```
├── public/        # Public assets
├── src/           # Source files
│   ├── App.tsx    # Main React component
│   ├── editor.ts  # Context menu implementation
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

- Context-sensitive menu options
- Node creation through context menu
- Action execution on nodes and connections
- Customizable menu appearance
- Submenu support
- Keyboard shortcut integration
- Dynamic menu content

## Implementation

The example demonstrates how to:

1. Set up the context menu plugin
2. Configure different menu items for various contexts
3. Create new nodes through the context menu
4. Implement actions for existing nodes and connections
5. Customize the appearance and behavior of the menu
6. Handle submenu navigation
7. Integrate keyboard shortcuts with menu options

## Learn More

For more information, visit [Rete.js Context Menu Example](https://retejs.org/examples/context-menu). 