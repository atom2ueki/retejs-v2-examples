export class ControlFlowEngine {
  constructor() {
    this.nodeMap = new Map();
    this.debug = false;
    this.nodeSubs = {};
  }

  subscribe(id, cb) {
    if (!this.nodeSubs[id]) this.nodeSubs[id] = [];
    this.nodeSubs[id].push(cb);
    
    return () => {
      if (!this.nodeSubs[id]) return;
      const index = this.nodeSubs[id].indexOf(cb);
      if (index !== -1) this.nodeSubs[id].splice(index, 1);
    };
  }

  executeNode(id, data = {}) {
    const node = this.nodeMap.get(id);
    
    if (!node) return null;
    
    if (this.nodeSubs[id] && this.nodeSubs[id].length > 0) {
      const results = this.nodeSubs[id].map((cb) => cb(data));
      
      return Promise.all(results).then((values) => {
        const result = values.find((value) => value && value.output);
        
        if (result && result.output) {
          const next = node.outputs && node.outputs[result.output];
          
          if (next && next.length > 0) {
            return Promise.all(next.map((n) => this.executeNode(n.id, result.data || data)));
          }
        }
        
        return null;
      });
    }
    
    const defaultAction = node.outputs && node.outputs.exec;
    
    if (defaultAction && defaultAction.length > 0) {
      return Promise.all(defaultAction.map((n) => this.executeNode(n.id, data)));
    }
    
    return null;
  }

  add(node) {
    if (this.nodeMap.has(node.id)) return;
    
    this.nodeMap.set(node.id, node);
  }

  clear() {
    this.nodeMap.clear();
    this.nodeSubs = {};
  }

  start(id, data = {}) {
    return this.executeNode(id, data);
  }
}
