import { AreaPlugin } from "rete-area-plugin";
import { DataflowEngine } from "./dataflow/engine";
import { ControlFlowEngine } from "./control-flow/engine";
import { NodeEditor, getUID } from "rete";
import { addSquareNode, addIfNode, addSeedNode, addConnection } from "./nodes";
import { createRoot } from "react-dom/client";
import { useState, useEffect } from "react";
import { Area } from "./area";

class Node {
  id: string;
  constructor() {
    this.id = getUID();
  }
}

export class Connection {
  id: string;
  source: string;
  target: string;
  sourceOutput: string;
  targetInput: string;

  constructor(source: Node, target: Node, sourceOutput: string, targetInput: string) {
    this.id = getUID();
    this.source = source.id;
    this.target = target.id;
    this.sourceOutput = sourceOutput;
    this.targetInput = targetInput;
  }
}

export default function App() {
  const [dataflow, setDataflow] = useState<DataflowEngine | null>(null);
  const [controlflow, setControlflow] = useState<ControlFlowEngine | null>(null);
  const [editor, setEditor] = useState<NodeEditor | null>(null);
  const [area, setArea] = useState<AreaPlugin<any, any> | null>(null);
  const [result, setResult] = useState<Record<string, unknown>>({});

  useEffect(() => {
    if (!editor || !area || !dataflow || !controlflow) return;

    const seed = addSeedNode(editor, { value: 4 }, { x: 50, y: 100 });
    const square = addSquareNode(editor, {}, { x: 330, y: 100 });
    const ifNode = addIfNode(editor, {}, { x: 330, y: 240 });

    addConnection(editor, seed, square, "value", "value");
    addConnection(editor, seed, ifNode, "value", "value");

    dataflow.addProcessor(seed.id, async () => {
      return {
        value: seed.data().value
      };
    });

    dataflow.addProcessor(square.id, async (inputs) => {
      if (!("value" in inputs)) return {};
      const value = inputs.value as number;

      return {
        value: value * value
      };
    });

    dataflow.addProcessor(ifNode.id, async (inputs) => {
      if (!("value" in inputs)) return {};
      const value = inputs.value as number;

      return {
        condition: value > 3
      };
    });

    controlflow.add({
      id: seed.id,
      outputs: {
        exec: [{ id: square.id, input: "exec" }, { id: ifNode.id, input: "exec" }]
      }
    });

    controlflow.add({
      id: square.id,
      inputs: { exec: [] },
      outputs: {}
    });

    controlflow.add({
      id: ifNode.id,
      inputs: { exec: [] },
      outputs: {
        true: [],
        false: []
      }
    });

    controlflow.subscribe(ifNode.id, async ({ condition }) => {
      if (!condition) {
        return { output: "false" };
      }
      return { output: "true" };
    });

    dataflow.subscribe(seed.id, async () => {});
    dataflow.subscribe(square.id, async (data) => {
      setResult((prev) => ({ ...prev, square: data.value }));
    });
    dataflow.subscribe(ifNode.id, async (data) => {
      setResult((prev) => ({ ...prev, if: data.condition }));
    });

    controlflow.start(seed.id);

    return () => {
      controlflow.clear();
      dataflow.reset();
    };
  }, [editor, area, dataflow, controlflow]);

  return (
    <div className="App">
      <Area
        ref={(area) => {
          if (area) {
            setArea(area.area);
            setEditor(area.editor);
            setDataflow(area.dataflow);
            setControlflow(area.controlflow);
          }
        }}
      />
      <div className="result">
        <h3>Result</h3>
        <div>{JSON.stringify(result)}</div>
      </div>
    </div>
  );
}

const element = document.getElementById("root");

if (element) {
  const root = createRoot(element);
  root.render(<App />);
}
