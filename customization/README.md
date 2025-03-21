# Rete.js Customization Example with React

This example demonstrates how to customize the appearance and behavior of a Rete.js node editor using React. It showcases various customization options including custom node designs, socket styles, connection appearances, and background effects.

The example illustrates how to override the default rendering components to create a unique visual experience while maintaining the core functionality of the node editor.

## Project Structure

```
├── public/              # Public assets
├── src/                 # Source files
│   ├── App.tsx          # Main React component
│   ├── CustomNode.tsx   # Custom node implementation
│   ├── CustomSocket.tsx # Custom socket implementation
│   ├── CustomConnection.tsx # Custom connection implementation
│   ├── StyledNode.tsx   # Node with styled components
│   ├── editor.ts        # Editor configuration
│   ├── custom-background.ts # Custom background implementation
│   ├── background.css   # Background styling
│   ├── index.tsx        # Entry point
│   ├── styles.css       # Basic styling
│   └── vars.ts          # Shared variables
├── package.json         # Project dependencies
└── tsconfig.json        # TypeScript configuration
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

- Complete UI customization of nodes, sockets and connections
- Custom node appearances and layouts
- Styled components integration
- Custom background patterns and effects
- Override of default component rendering
- Theming capabilities
- Interactive element styling

## Implementation

The example demonstrates how to:

1. Create custom React components for nodes, sockets, and connections
2. Implement styled-components for consistent theming
3. Build custom background patterns and effects
4. Override default rendering behavior
5. Maintain functionality while changing appearance
6. Create a cohesive visual language across editor elements

## Learn More

For more information, visit [Rete.js Customization Example with React](https://retejs.org/examples/customization/react). 