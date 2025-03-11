
import React from 'react';
import { EdgeProps, getBezierPath } from 'reactflow';
import { ConnectionType } from '@/utils/flowTypes';

interface FlowConnectorProps extends EdgeProps {
  data?: {
    type: ConnectionType;
  };
}

const connectionColors = {
  positive: '#32CD32',
  negative: '#FF4136',
  neutral: '#AAAAAA'
};

const FlowConnector: React.FC<FlowConnectorProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  markerEnd
}) => {
  const connectionType = data?.type || 'neutral';
  const strokeColor = connectionColors[connectionType];
  
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    curvature: 0.2
  });
  
  return (
    <path
      id={id}
      className="flow-connection"
      style={{
        ...style,
        stroke: strokeColor,
        strokeWidth: 3,
        strokeLinecap: 'round',
        animation: `flowAnimation ${connectionType === 'positive' ? '30s' : '60s'} linear infinite`
      }}
      d={edgePath}
      markerEnd={markerEnd}
    />
  );
};

export default FlowConnector;
