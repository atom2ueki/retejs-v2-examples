import { AreaPlugin } from "rete-area-plugin";
import { DataflowEngine } from "./dataflow-engine";
import { NodeEditor, getUID } from "rete";
import { addNumber, addConnection, addAdd } from "./nodes";
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
  const [editor, setEditor] = useState<NodeEditor | null>(null);
  const [area, setArea] = useState<AreaPlugin<any, any> | null>(null);
  const [result, setResult] = useState<Record<string, unknown>>({});

  useEffect(() => {
    if (!editor || !area || !dataflow) return;

    const a = addNumber(editor, { value: 1 }, { x: 30, y: 120 });
    const b = addNumber(editor, { value: 3 }, { x: 30, y: 300 });
    const add = addAdd(editor, {}, { x: 340, y: 210 });

    addConnection(editor, a, add, "value", "a");
    addConnection(editor, b, add, "value", "b");

    dataflow.addProcessor(add.id, async (inputs) => {
      if ("a" in inputs && "b" in inputs) {
        const a = inputs["a"] as number;
        const b = inputs["b"] as number;

        return {
          sum: a + b
        };
      }
      return {};
    });

    dataflow.subscribe(add.id, async (data) => {
      setResult(data);
    });

    return () => {
      dataflow.reset();
    };
  }, [editor, area, dataflow]);

  return (
    <div className="App">
      <Area
        ref={(area) => {
          if (area) {
            setArea(area.area);
            setEditor(area.editor);
            setDataflow(area.dataflow);
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
