# Rete.js Controls Example

This example demonstrates how to implement various control elements in a Rete.js node editor, allowing users to interact with and manipulate node data in different ways.

## Project Description

Controls in node editors enable users to input and modify data that flows through the node graph. This example showcases different types of controls like text inputs, number sliders, dropdowns, checkboxes, and more, demonstrating how to create interactive nodes with various input methods.

## Project Structure

```
├── public/                 # Public assets
├── src/                    # Source files
│   ├── App.tsx             # Main React component
│   ├── editor.ts           # Controls implementation
│   ├── controls/           # Control components
│   │   ├── TextControl.tsx # Text input control
│   │   ├── NumberControl.tsx # Number input control
│   │   └── SelectControl.tsx # Dropdown control
│   ├── index.tsx           # Entry point
│   └── styles.css          # Control styling
├── package.json            # Project dependencies
└── tsconfig.json           # TypeScript configuration
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

- Text input controls
- Numerical sliders
- Dropdown selectors
- Checkbox toggles
- Color pickers
- Range sliders
- Custom validation
- Real-time control updates

## Implementation

The example demonstrates how to:

1. Create custom control components
2. Integrate controls with node inputs and outputs
3. Handle user input events
4. Validate and sanitize user input
5. Update node data based on control values
6. Create responsive and accessible controls
7. Style controls to match the editor theme
8. Implement complex controls with custom logic

## Learn More

For more information, visit [Rete.js Controls Example](https://retejs.org/examples/controls). 