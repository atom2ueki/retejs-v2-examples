import { ClassicPreset, NodeEditor } from "rete";
import { React } from "react";
import { Connection } from "./App";

export class NumberNode extends ClassicPreset.Node {
  constructor(initial) {
    super("Number");
    this.addOutput("value", new ClassicPreset.Output(socket, "Number"));
    this.addControl(
      "value",
      new ClassicPreset.InputControl("number", { initial: initial.value })
    );
  }

  data() {
    return {
      value: this.controls.value.value
    };
  }
}

export class AddNode extends ClassicPreset.Node {
  constructor(initial) {
    super("Add");
    this.addInput("a", new ClassicPreset.Input(socket, "A"));
    this.addInput("b", new ClassicPreset.Input(socket, "B"));
    this.addOutput("sum", new ClassicPreset.Output(socket, "Sum"));
  }
}

export const socket = new ClassicPreset.Socket("socket");

export function addConnection(editor, source, target, sourceOutput, targetInput) {
  const connection = new Connection(source, target, sourceOutput, targetInput);

  editor.addConnection(connection);

  return connection;
}

export function addNumber(editor, { value }, position) {
  const node = new NumberNode({ value });

  editor.addNode(node);
  editor.setNodePosition(node.id, position);

  return node;
}

export function addAdd(editor, {}, position) {
  const node = new AddNode({});

  editor.addNode(node);
  editor.setNodePosition(node.id, position);

  return node;
}
