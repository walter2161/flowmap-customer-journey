
import React from 'react';
import { EdgeProps, getBezierPath, useReactFlow } from 'reactflow';
import { ConnectionType } from '@/utils/flowTypes';

interface FlowConnectorProps extends EdgeProps {
  data?: {
    type: ConnectionType;
  };
}

const connectionColors = {
  positive: '#10B981', // Green
  negative: '#EF4444', // Red
  neutral: '#6B7280'  // Gray
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
}) => {
  const { setEdges } = useReactFlow();
  const connectionType = data?.type || 'neutral';
  const strokeColor = connectionColors[connectionType];
  
  // getBezierPath returns an array - extract the path string and center coordinates
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  
  const onEdgeClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
  };

  return (
    <>
      <path
        id={id}
        className="flow-connection"
        d={edgePath}
        style={{
          stroke: strokeColor,
          strokeWidth: 3,
          strokeLinecap: 'round',
          fill: 'none',
          zIndex: 1000,
        }}
      />
      
      {/* Delete button in the middle of the path */}
      <foreignObject
        width={20}
        height={20}
        x={labelX - 10}
        y={labelY - 10}
        className="flow-connection-delete-btn"
      >
        <div className="flex items-center justify-center w-full h-full">
          <button
            className="w-5 h-5 rounded-full bg-white border border-gray-200 text-gray-400 flex items-center justify-center hover:bg-gray-100 hover:text-gray-600 transition-colors"
            onClick={onEdgeClick}
          >
            ×
          </button>
        </div>
      </foreignObject>
    </>
  );
};

export default FlowConnector;
