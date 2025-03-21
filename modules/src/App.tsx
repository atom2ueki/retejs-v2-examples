import { useEffect, useState } from "react";
import { createEditor } from "./editor";
import { Tabs, Button, Space } from "antd";
import "antd/dist/reset.css";
import { useRete } from "rete-react-plugin";

export default function App() {
  const [ref, editor] = useRete(createEditor);
  const [modules, setModules] = useState<string[]>([]);

  useEffect(() => {
    if (editor) {
      const list = editor.getModules();
      setModules(list);
      editor.openModule(list[0]);
    }
  }, [editor]);

  return (
    <div className="App">
      {editor && (
        <Space className="header">
          <Tabs
            onChange={(path) => {
              editor.openModule(path);
            }}
            items={modules.map((path) => ({
              key: path,
              label: path
            }))}
          />
          <Button
            size="small"
            onClick={() => {
              const name = prompt("Module name");

              if (name) {
                editor?.newModule(name);
                setModules(editor.getModules());
              }
            }}
          >
            New
          </Button>
          <Button size="small" onClick={() => editor?.saveModule()}>
            Save
          </Button>
          <Button size="small" onClick={() => editor?.restoreModule()}>
            Restore
          </Button>
        </Space>
      )}
      <div ref={ref} style={{ height: "100vh", width: "100vw" }}></div>
    </div>
  );
}
