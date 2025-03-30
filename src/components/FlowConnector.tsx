
import React from 'react';
import { getBezierPath, EdgeProps } from 'reactflow';

const cardTypeColors = {
  initial: "blue",
  servico: "green",
  agendar: "purple",
  confirmacao: "indigo",
  promocao: "orange",
  produto: "red",
  arquivo: "yellow",
  profile: "blue"   // Added missing 'profile' type
};

// Default connector component for flow edges
const FlowConnector = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd
}: EdgeProps) => {
  // Get connection type from edge data
  const connectionType = data?.type || 'positive';
  
  // Get path for the edge
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  
  // Get color based on connection type
  let strokeColor = '#aaa';
  
  if (connectionType === 'positive') {
    strokeColor = '#10b981'; // green
  } else if (connectionType === 'negative') {
    strokeColor = '#ef4444'; // red
  } else if (connectionType === 'neutral') {
    strokeColor = '#3b82f6'; // blue
  }
  
  return (
    <path
      id={id}
      style={{ 
        stroke: strokeColor,
        strokeWidth: 2
      }}
      className="react-flow__edge-path"
      d={edgePath}
      markerEnd={markerEnd}
    />
  );
};

// Export as named export
export { FlowConnector };
