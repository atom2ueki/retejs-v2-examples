import { NodeEditor, ClassicPreset, GetSchemes } from "rete";
import { AreaPlugin, AreaExtensions } from "rete-area-plugin";
import { ConnectionPlugin } from "rete-connection-plugin";
import { ReactPlugin, Presets } from "rete-react-plugin";
import { createRoot } from "react-dom/client";
import React, { useEffect, useCallback, forwardRef, useImperativeHandle } from "react";
import { DataflowEngine } from "./dataflow-engine";

export const Area = forwardRef((props, ref) => {
  const createEditor = useCallback(async () => {
    const container = document.querySelector(".rete");
    const editor = new NodeEditor();
    const area = new AreaPlugin(container);
    const connection = new ConnectionPlugin();
    const render = new ReactPlugin({ createRoot });
    const dataflow = new DataflowEngine();

    area.use(connection);
    area.use(render);

    editor.use(area);

    dataflow.outputConnections = (id, key) => {
      return editor
        .getConnections()
        .filter((c) => c.source === id && c.sourceOutput === key)
        .map((c) => ({ target: c.target, input: c.targetInput }));
    };

    render.addPreset(Presets.classic.setup());

    render.addPreset(
      Presets.contextMenu.setup({
        allocate: (id) => {
          return ["add"];
        },
        items: {
          add: {
            label: "Add",
            handler: async () => {
              // Handler for adding nodes
            }
          }
        }
      })
    );

    AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
      accumulating: AreaExtensions.accumulateOnCtrl()
    });

    return {
      destroy: () => area.destroy(),
      editor,
      area,
      dataflow
    };
  }, []);

  useEffect(() => {
    let instance;

    createEditor().then((value) => {
      instance = value;
      if (ref && "current" in ref) {
        ref.current = instance;
      }
    });

    return () => {
      instance?.destroy();
    };
  }, [createEditor, ref]);

  useImperativeHandle(
    ref,
    () => {
      return null;
    },
    []
  );

  return <div className="rete" style={{ width: "100%", height: "80vh" }} />;
});
