# Rete.js v2 - Basic React Example

This is a basic example of using Rete.js v2 with React. It demonstrates how to create a simple node editor with two connected nodes, each equipped with an input field.

## Features

- Basic editor setup with React.js
- Two connected nodes with input controls
- Node selection capability
- Pan and zoom functionality

## Dependencies

- react/react-dom 18.2.0
- rete 2.0.3
- rete-area-plugin 2.0.3
- rete-connection-plugin 2.0.3
- rete-react-plugin 2.0.5
- rete-render-utils 2.0.2

## How to Run

1. Install the dependencies:
```
npm install
```

2. Start the development server:
```
npm start
```

3. Open the browser at http://localhost:3000

## Code Structure

- `App.tsx`: Main component that uses the `useRete` hook to create the editor
- `editor.ts`: Core editor setup with node creation and connection
- `index.tsx`: Entry point for the React application
- `styles.css`: Basic styling