import { useRete } from "rete-react-plugin";
import { createEditor } from "./editor";
import styled from "styled-components";
import { Button, Switch } from "antd";
import { useState } from "react";

const LayoutAction = styled.div`
  position: absolute;
  top: 1em;
  right: 1em;
  display: flex;
  align-items: center;
  gap: 0.5em;
`;

export default function App() {
  const [ref, editor] = useRete(createEditor);
  const [animate, setAnimate] = useState(true);

  return (
    <div className="App">
      <LayoutAction>
        Animate
        <Switch checked={animate} onChange={setAnimate} />
        <Button onClick={() => editor?.layout(animate)}>Layout</Button>
      </LayoutAction>
      <div ref={ref} style={{ height: "100vh", width: "100vw" }}></div>
    </div>
  );
}
