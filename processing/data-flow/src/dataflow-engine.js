export class DataflowEngine {
  constructor() {
    this.state = {};
    this.nodes = {};
    this.inputs = {};
    this.inProgress = {};
  }

  addNode(id) {
    if (this.nodes[id]) return;
    this.nodes[id] = true;
    this.inputs[id] = {};
    this.state[id] = {};
  }

  removeNode(id) {
    if (!this.nodes[id]) return;
    delete this.nodes[id];
    delete this.inputs[id];
    delete this.state[id];
  }

  subscribe(id, handler) {
    const prev = this.state[id] || {};

    if (!this.nodes[id]) return () => undefined;
    this.state[id] = { handler, data: prev.data || {} };

    if (prev.data) {
      Promise.resolve().then(async () => {
        await handler(prev.data);
      });
    }

    return () => {
      if (!this.state[id]) return;
      const { data } = this.state[id];

      delete this.state[id].handler;
      this.state[id].data = data;
    };
  }

  addProcessor(id, processor) {
    if (!this.nodes[id]) return () => undefined;
    this.state[id] = { processor, data: {} };

    return () => {
      if (!this.state[id]) return;
      const { data } = this.state[id];

      delete this.state[id].processor;
      this.state[id].data = data;
    };
  }

  fetchInputs(id) {
    if (!this.nodes[id]) return null;
    return this.inputs[id] || {};
  }

  reset() {
    this.nodes = {};
    this.inputs = {};
    this.state = {};
    this.inProgress = {};
  }

  async output(id, output, data) {
    if (!this.outputConnections) return false;
    if (id in this.inProgress && output in this.inProgress[id]) return false;

    this.inProgress[id] = this.inProgress[id] || {};
    this.inProgress[id][output] = true;

    const connections = this.outputConnections(id, output);

    for (const { target, input } of connections) {
      await this.modifyInput(target, input, data);
    }
    if (this.inProgress[id]) delete this.inProgress[id][output];

    return true;
  }

  async modifyInput(id, input, data) {
    if (!this.nodes[id]) return;

    this.inputs[id] = this.inputs[id] || {};
    this.inputs[id][input] = data;

    await this.processNode(id);
  }

  async processNode(id) {
    if (!this.nodes[id]) return false;

    const inputs = this.fetchInputs(id);
    const { processor, handler } = this.state[id] || {};

    if (!processor && !handler) return false;

    let outputs = {};

    if (processor) {
      outputs = await processor(inputs);
    }

    if (handler) {
      handler(outputs);
    }

    for (const [name, value] of Object.entries(outputs)) {
      await this.output(id, name, value);
    }

    const prev = this.state[id] || {};

    if (prev) {
      this.state[id].data = outputs;
    }

    return true;
  }
}