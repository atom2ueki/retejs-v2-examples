export class DataflowEngine {
  constructor(log) {
    this.editor = null;
    this.log = log || console.log;
    this.cache = new Map();
  }

  setLog(log) {
    this.log = log;
  }

  async resolveInputs(nodeId, inputs) {
    const node = this.editor.getNode(nodeId);
    const resolved = {};

    this.log(`Resolving inputs for node '${node.label}' (${nodeId})`);

    for (const [key, input] of inputs) {
      this.log(`- Processing input '${key}'`);
      
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

      const outputs = await this.fetch(sourceId);
      resolved[key] = outputs[sourceOutput];

      this.log(`  - Resolved value: ${resolved[key]}`);
    }

    return resolved;
  }

  async fetch(nodeId) {
    if (this.cache.has(nodeId)) {
      this.log(`Using cached result for node ${nodeId}`);
      return this.cache.get(nodeId);
    }

    const node = this.editor.getNode(nodeId);
    
    this.log(`Fetching data from node '${node.label}' (${nodeId})`);
    
    // Get data function from node
    const nodeData = await node.data?.();
    
    if (!nodeData?.compute) {
      this.log(`Node '${node.label}' has no compute function`); 
      return {};
    }
    
    // Resolve inputs for this node
    const inputs = await this.resolveInputs(nodeId, node.inputs);
    
    // Compute outputs
    const outputs = await nodeData.compute(inputs, { ...nodeData });
    
    this.log(`Node '${node.label}' computed outputs: ${JSON.stringify(outputs)}`);
    
    // Cache the result
    this.cache.set(nodeId, outputs);
    
    return outputs;
  }

  async reset() {
    this.cache.clear();
    this.log(`Cache cleared`);
  }

  use(editor) {
    this.editor = editor;
    
    // Reset cache on any changes to the graph
    this.editor.addPipe(context => {
      if (
        context.type === 'nodecreated' ||
        context.type === 'noderemoved' ||
        context.type === 'connectioncreated' ||
        context.type === 'connectionremoved' ||
        (context.type === 'controlchanged' && this.cache.size)
      ) {
        this.reset();
      }
      return context;
    });
  }
}