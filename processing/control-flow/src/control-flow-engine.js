export class ControlFlowEngine {
  constructor(log) {
    this.editor = null;
    this.log = log || console.log;
  }

  async getNextNodes(nodeId, output) {
    const connections = this.editor.getConnections().filter(c => {
      return c.source === nodeId && (!output || c.sourceOutput === output);
    });

    const node = this.editor.getNode(nodeId);
    this.log(`Finding next nodes from '${node.label}' (${nodeId}) ${output ? `via output '${output}'` : ''}`);

    // Get target nodes from connections
    const targetIds = connections.map(c => c.target);
    const targets = [...new Set(targetIds)].map(id => this.editor.getNode(id));

    this.log(`Found ${targets.length} next nodes: ${targets.map(n => `'${n.label}'`).join(', ')}`);

    return targets;
  }

  async resolveDataInputs(nodeId) {
    const node = this.editor.getNode(nodeId);
    const dataInputs = [...node.inputs].filter(([_, input]) => input.socket.name === 'data');
    const resolved = {};

    this.log(`Resolving data inputs for node '${node.label}' (${nodeId})`);

    for (const [key, input] of dataInputs) {
      this.log(`- Processing data input '${key}'`);

      const connections = this.editor.getConnections().filter(c => {
        return c.target === input.id && c.targetInput === key;
      });

      if (connections.length === 0) {
        this.log(`  - No connections to input '${key}'`);
        resolved[key] = undefined;
        continue;
      }

      const connection = connections[0];
      const sourceId = connection.source;
      const sourceOutput = connection.sourceOutput;
      const sourceNode = this.editor.getNode(sourceId);

      this.log(`  - Connected to node '${sourceNode.label}' (${sourceId}) output '${sourceOutput}'`);

      // Get data from the node's execution
      const outputs = this.nodeOutputs.get(sourceId) || {};
      resolved[key] = outputs[sourceOutput];

      this.log(`  - Resolved value: ${resolved[key]}`);
    }

    return resolved;
  }

  async execute(startNodeId) {
    this.nodeOutputs = new Map();
    const visited = new Set();
    let currentNodeId = startNodeId;

    // Start processing at the start node
    await this.processNode(currentNodeId, visited);
  }

  async processNode(nodeId, visited) {
    // Prevent infinite loops
    if (visited.has(nodeId)) {
      this.log(`Node ${nodeId} already visited, skipping to prevent loop`);
      return;
    }

    visited.add(nodeId);
    const node = this.editor.getNode(nodeId);
    
    this.log(`Processing node '${node.label}' (${nodeId})`);

    // Get node data and execution function
    const inputs = await this.resolveDataInputs(nodeId);
    const nodeData = await node.data?.();

    if (!nodeData?.execute) {
      this.log(`Node '${node.label}' has no execute function`); 
      return;
    }

    // Execute the node
    const outputs = await nodeData.execute(inputs, { ...nodeData });
    this.nodeOutputs.set(nodeId, outputs);

    if (outputs?.log) {
      this.log(outputs.log);
    }

    // If this is an end node, stop execution
    if (outputs?.end) {
      this.log(`Reached end node '${node.label}'`);
      return;
    }

    // Get the next nodes to process based on outputs
    const outputKey = outputs?.flow ? outputs.flow : 'flow';
    const nextNodes = await this.getNextNodes(nodeId, outputKey);

    // Process each next node
    for (const nextNode of nextNodes) {
      await this.processNode(nextNode.id, new Set(visited));
    }
  }

  use(editor) {
    this.editor = editor;
  }
}