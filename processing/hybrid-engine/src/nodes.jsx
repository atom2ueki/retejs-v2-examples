import { ClassicPreset, NodeEditor } from "rete";
import { React } from "react";
import { Connection } from "./App";

export const socket = new ClassicPreset.Socket("socket");
export const flowSocket = new ClassicPreset.Socket("flow");

export class SeedNode extends ClassicPreset.Node {
  constructor(initial) {
    super("Seed");
    this.addControl(
      "value",
      new ClassicPreset.InputControl("number", { initial: initial.value })
    );
    this.addOutput("value", new ClassicPreset.Output(socket, "Number"));
    this.addOutput("exec", new ClassicPreset.Output(flowSocket, "Exec"));
  }

  data() {
    return {
      value: Number(this.controls.value.value)
    };
  }
}

export class SquareNode extends ClassicPreset.Node {
  constructor() {
    super("Square");
    this.addInput("exec", new ClassicPreset.Input(flowSocket, "Exec"));
    this.addInput("value", new ClassicPreset.Input(socket, "Number"));
    this.addOutput("value", new ClassicPreset.Output(socket, "Squared"));
  }
}

export class IfNode extends ClassicPreset.Node {
  constructor() {
    super("If");
    this.addInput("exec", new ClassicPreset.Input(flowSocket, "Exec"));
    this.addInput("value", new ClassicPreset.Input(socket, "Number"));
    this.addOutput("condition", new ClassicPreset.Output(socket, "Condition"));
    this.addOutput("true", new ClassicPreset.Output(flowSocket, "True"));
    this.addOutput("false", new ClassicPreset.Output(flowSocket, "False"));
  }
}

export function addSeedNode(editor, { value }, position) {
  const node = new SeedNode({ value });

  editor.addNode(node);
  editor.setNodePosition(node.id, position);

  return node;
}

export function addSquareNode(editor, {}, position) {
  const node = new SquareNode({});

  editor.addNode(node);
  editor.setNodePosition(node.id, position);

  return node;
}

export function addIfNode(editor, {}, position) {
  const node = new IfNode({});

  editor.addNode(node);
  editor.setNodePosition(node.id, position);

  return node;
}

export function addConnection(editor, source, target, sourceOutput, targetInput) {
  const connection = new Connection(source, target, sourceOutput, targetInput);

  editor.addConnection(connection);

  return connection;
}
