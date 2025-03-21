import React from 'react';
import { ClassicPreset } from 'rete';
import { useRete } from 'rete-react-plugin';
import styled from 'styled-components';

const NodeContainer = styled.div`
  background: linear-gradient(180deg, #4a4e69 0%, #22223b 100%);
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  color: white;
  border: 2px solid ${props => props.selected ? '#9a8c98' : 'transparent'};
  transition: all 0.2s ease;
  min-width: 180px;
  padding-bottom: 8px;
  
  &:hover {
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  }
`;

const NodeHeader = styled.div`
  padding: 10px 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  font-weight: bold;
  font-size: 1.1em;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NodeContent = styled.div`
  padding: 10px;
`;

const NodeIOContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
`;

const IOContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SocketLabel = styled.div`
  margin: 0 10px;
  font-size: 0.85em;
  color: #f1faee;
`;

const SocketContainer = styled.div`
  display: flex;
  align-items: center;
`;

export function CustomNode(props) {
  const { data } = props;
  const { inputs, outputs, controls, id, selected } = data;
  const { nodeId } = data;

  const render = useRete();
  const controlRef = React.useRef(null);

  React.useEffect(() => {
    const control = Object.values(controls)[0];
    if (control && controlRef.current) {
      render(control, controlRef.current);
    }
  }, [controls, render]);

  return (
    <NodeContainer selected={selected}>
      <NodeHeader>{data.label}</NodeHeader>
      <NodeContent>
        <div ref={controlRef}></div>
        <NodeIOContainer>
          <IOContainer>
            {Object.entries(inputs).map(([key, input]) => (
              <SocketContainer key={key}>
                {render(input)}
                <SocketLabel>{key}</SocketLabel>
              </SocketContainer>
            ))}
          </IOContainer>
          <IOContainer>
            {Object.entries(outputs).map(([key, output]) => (
              <SocketContainer key={key}>
                <SocketLabel>{key}</SocketLabel>
                {render(output)}
              </SocketContainer>
            ))}
          </IOContainer>
        </NodeIOContainer>
      </NodeContent>
    </NodeContainer>
  );
}