
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
  profile: "blue", // Added missing 'profile' type
  basic: "gray"  // Added 'basic' type with gray color
};

// Default connector component for flow edges
export const FlowConnector = ({
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
  const sourceCardType = data?.sourceCardType || 'regular';
  
  // Get path for the edge
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  
  // Get color based on connection type or card type
  let strokeColor = '#aaa';
  
  if (connectionType === 'positive') {
    strokeColor = '#10b981'; // green
  } else if (connectionType === 'negative') {
    strokeColor = '#ef4444'; // red
  } else if (connectionType === 'neutral') {
    strokeColor = '#3b82f6'; // blue
  } else if (sourceCardType && cardTypeColors[sourceCardType as keyof typeof cardTypeColors]) {
    // Use card type color if connection type is not specified but we know the source card type
    const colorName = cardTypeColors[sourceCardType as keyof typeof cardTypeColors];
    switch (colorName) {
      case "blue":
        strokeColor = '#3b82f6';
        break;
      case "green":
        strokeColor = '#10b981';
        break;
      case "purple":
        strokeColor = '#8b5cf6';
        break;
      case "indigo":
        strokeColor = '#6366f1';
        break;
      case "orange":
        strokeColor = '#f97316';
        break;
      case "red":
        strokeColor = '#ef4444';
        break;
      case "yellow":
        strokeColor = '#eab308';
        break;
      case "gray":
        strokeColor = '#6b7280';
        break;
      default:
        strokeColor = '#3b82f6'; // Default to blue
    }
  }
  
  return (
    <path
      id={id}
      style={{ 
        stroke: strokeColor,
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
      }}
      className="react-flow__edge-path"
      d={edgePath}
      markerEnd={markerEnd}
    />
  );
};
