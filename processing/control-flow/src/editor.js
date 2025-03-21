import { createRoot } from 'react-dom/client';
import { NodeEditor, ClassicPreset } from 'rete';
import { AreaPlugin, AreaExtensions } from 'rete-area-plugin';
import { ConnectionPlugin } from 'rete-connection-plugin';
import { ReactRenderPlugin, Presets as ReactPresets } from 'rete-react-plugin';
import { ControlFlowEngine } from './control-flow-engine';

class StartNode extends ClassicPreset.Node {
  constructor() {
    super('Start');
    this.addOutput('flow', new ClassicPreset.Output(flowSocket, 'Flow'));
  }

  data() {
    return {
      execute() {}
    };
  }
}

class NumberNode extends ClassicPreset.Node {
  constructor(value) {
    super('Number');
    this.addInput('flow', new ClassicPreset.Input(flowSocket, 'Flow'));
    this.addOutput('flow', new ClassicPreset.Output(flowSocket, 'Flow'));
    this.addOutput('value', new ClassicPreset.Output(dataSocket, 'Value'));
    this.addControl('value', new ClassicPreset.InputControl('number', { initial: value }));
  }

  data() {
    return {
      execute() {
        return { value: this.controls.value.value };
      }
    };
  }
}

class IfNode extends ClassicPreset.Node {
  constructor() {
    super('If Condition');
    this.addInput('flow', new ClassicPreset.Input(flowSocket, 'Flow'));
    this.addInput('condition', new ClassicPreset.Input(dataSocket, 'Condition'));
    this.addOutput('true', new ClassicPreset.Output(flowSocket, 'True'));
    this.addOutput('false', new ClassicPreset.Output(flowSocket, 'False'));
  }

  data(inputs) {
    return {
      execute({ condition }) {
        // Determine which output to use based on condition
        const outputKey = condition ? 'true' : 'false';
        return { flow: outputKey };
      }
    };
  }
}

class LogNode extends ClassicPreset.Node {
  constructor(message = 'Log message') {
    super('Log');
    this.addInput('flow', new ClassicPreset.Input(flowSocket, 'Flow'));
    this.addInput('message', new ClassicPreset.Input(dataSocket, 'Message'));
    this.addOutput('flow', new ClassicPreset.Output(flowSocket, 'Flow'));
    this.addControl('message', new ClassicPreset.InputControl('text', { initial: message }));
  }

  data() {
    return {
      execute({ message }) {
        const logMessage = message || this.controls.message.value;
        return { log: `LOG: ${logMessage}` };
      }
    };
  }
}

class CompareNode extends ClassicPreset.Node {
  constructor() {
    super('Compare');
    this.addInput('flow', new ClassicPreset.Input(flowSocket, 'Flow'));
    this.addInput('a', new ClassicPreset.Input(dataSocket, 'A'));
    this.addInput('b', new ClassicPreset.Input(dataSocket, 'B'));
    this.addOutput('flow', new ClassicPreset.Output(flowSocket, 'Flow'));
    this.addOutput('result', new ClassicPreset.Output(dataSocket, 'Result'));
    this.addControl('operator', new ClassicPreset.InputControl('select', { 
      initial: 'equal',
      values: ['equal', 'not-equal', 'greater', 'less']
    }));
  }

  data() {
    return {
      execute({ a, b }) {
        const operator = this.controls.operator.value;
        let result = false;
        
        switch (operator) {
          case 'equal':
            result = a === b;
            break;
          case 'not-equal':
            result = a !== b;
            break;
          case 'greater':
            result = a > b;
            break;
          case 'less':
            result = a < b;
            break;
        }
        
        return { result };
      }
    };
  }
}

class EndNode extends ClassicPreset.Node {
  constructor() {
    super('End');
    this.addInput('flow', new ClassicPreset.Input(flowSocket, 'Flow'));
  }

  data() {
    return {
      execute() {
        return { end: true };
      }
    };
  }
}

class Connection extends ClassicPreset.Connection {}

const flowSocket = new ClassicPreset.Socket('flow');
const dataSocket = new ClassicPreset.Socket('data');

export async function createEditor(container, log) {
  const editor = new NodeEditor();
  const area = new AreaPlugin(container);
  const connection = new ConnectionPlugin();
  const render = new ReactRenderPlugin({ createRoot });
  const engine = new ControlFlowEngine(log);

  editor.use(engine);

  render.addPreset(ReactPresets.classic.setup());

  editor.use(area);
  area.use(connection);
  area.use(render);

  AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
    accumulating: AreaExtensions.accumulateOnCtrl()
  });

  // Add a button to trigger the flow
  const button = document.createElement('button');
  button.textContent = 'Execute Flow';
  button.style.position = 'absolute';
  button.style.top = '10px';
  button.style.right = '10px';
  button.style.zIndex = '1000';
  button.addEventListener('click', async () => {
    // Find a start node
    const startNode = editor.getNodes().find(n => n instanceof StartNode);
    if (startNode) {
      log(`Starting control flow execution...`);
      await engine.execute(startNode.id);
      log(`Execution completed`);
    } else {
      log(`Error: No start node found`);
    }
  });
  container.appendChild(button);

  // Create nodes
  const start = new StartNode();
  const number1 = new NumberNode(5);
  const number2 = new NumberNode(10);
  const compare = new CompareNode();
  const ifNode = new IfNode();
  const logTrue = new LogNode('Condition is TRUE');
  const logFalse = new LogNode('Condition is FALSE');
  const end = new EndNode();

  await editor.addNode(start);
  await editor.addNode(number1);
  await editor.addNode(number2);
  await editor.addNode(compare);
  await editor.addNode(ifNode);
  await editor.addNode(logTrue);
  await editor.addNode(logFalse);
  await editor.addNode(end);

  // Position nodes
  await area.translate(start.id, { x: 50, y: 200 });
  await area.translate(number1.id, { x: 250, y: 100 });
  await area.translate(number2.id, { x: 250, y: 300 });
  await area.translate(compare.id, { x: 450, y: 200 });
  await area.translate(ifNode.id, { x: 650, y: 200 });
  await area.translate(logTrue.id, { x: 850, y: 100 });
  await area.translate(logFalse.id, { x: 850, y: 300 });
  await area.translate(end.id, { x: 1050, y: 200 });

  // Create connections
  await editor.addConnection(new Connection(start.outputs.get('flow'), number1.inputs.get('flow')));
  await editor.addConnection(new Connection(number1.outputs.get('flow'), number2.inputs.get('flow')));
  await editor.addConnection(new Connection(number2.outputs.get('flow'), compare.inputs.get('flow')));
  await editor.addConnection(new Connection(compare.outputs.get('flow'), ifNode.inputs.get('flow')));
  
  await editor.addConnection(new Connection(number1.outputs.get('value'), compare.inputs.get('a')));
  await editor.addConnection(new Connection(number2.outputs.get('value'), compare.inputs.get('b')));
  await editor.addConnection(new Connection(compare.outputs.get('result'), ifNode.inputs.get('condition')));
  
  await editor.addConnection(new Connection(ifNode.outputs.get('true'), logTrue.inputs.get('flow')));
  await editor.addConnection(new Connection(ifNode.outputs.get('false'), logFalse.inputs.get('flow')));
  
  await editor.addConnection(new Connection(logTrue.outputs.get('flow'), end.inputs.get('flow')));
  await editor.addConnection(new Connection(logFalse.outputs.get('flow'), end.inputs.get('flow')));

  // Zoom to fit
  AreaExtensions.zoomAt(area, editor.getNodes());

  return {
    destroy: () => {
      area.destroy();
      container.innerHTML = '';
    }
  };
}