import React from 'react';
import styled from 'styled-components';

const SocketCircle = styled.circle`
  fill: #f1faee;
  stroke: #4a4e69;
  stroke-width: 2px;
  r: 6px;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    fill: #a8dadc;
    r: 7px;
    stroke-width: 3px;
  }
`;

export function CustomSocket(props) {
  const { data } = props;
  const { payload } = data;

  return (
    <SocketCircle cx={0} cy={0} />
  );
}