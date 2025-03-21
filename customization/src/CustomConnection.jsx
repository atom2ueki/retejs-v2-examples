import React from 'react';
import styled from 'styled-components';

const Path = styled.path`
  stroke: #9a8c98;
  stroke-width: 2px;
  fill: none;
  pointer-events: all;
  transition: stroke 0.3s;

  &:hover {
    stroke: #c9ada7;
    stroke-width: 3px;
  }
`;

const Circle = styled.circle`
  fill: #9a8c98;
  r: 4px;
`;

export function CustomConnection(props) {
  const { data } = props;
  const { path, source, target, start, end } = data;

  const [hovering, setHovering] = React.useState(false);

  return (
    <g>
      <Path 
        className="connection" 
        d={path} 
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      />
      {hovering && (
        <>
          <Circle cx={start.x} cy={start.y} />
          <Circle cx={end.x} cy={end.y} />
        </>
      )}
    </g>
  );
}