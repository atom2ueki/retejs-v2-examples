# Rete.js Comments Example

This example demonstrates how to implement comment functionality in a Rete.js node editor, allowing users to add explanatory notes and annotations to their node graphs.

## Project Description

Comments are essential for documenting complex node graphs and explaining the purpose and behavior of different parts of a workflow. This example shows how to implement resizable, draggable comment boxes that can be associated with nodes or used as standalone annotations in a Rete.js editor.

## Project Structure

```
├── public/        # Public assets
├── src/           # Source files
│   ├── App.tsx    # Main React component
│   ├── editor.ts  # Comments implementation
│   ├── comment.ts # Comment component
│   ├── index.tsx  # Entry point
│   └── styles.css # Comment styling
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

- Resizable comment boxes
- Draggable positioning
- Text formatting options
- Node association
- Color-coded comments
- Multi-line text support
- Comment visibility toggling
- Z-index management

## Implementation

The example demonstrates how to:

1. Create comment components in the editor
2. Implement drag-and-drop functionality for positioning
3. Add resizing capabilities to comments
4. Associate comments with specific nodes
5. Handle text editing and formatting
6. Manage comment visibility and z-index
7. Save and restore comments with the editor state
8. Style comments for better visual organization

## Learn More

For more information, visit [Rete.js Comments Example](https://retejs.org/examples/comments). 