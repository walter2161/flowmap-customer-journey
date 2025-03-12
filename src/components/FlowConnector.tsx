
import React from 'react';
import { EdgeProps, getBezierPath } from 'reactflow';
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
  const connectionType = data?.type || 'neutral';
  const strokeColor = connectionColors[connectionType];
  
  // Get the bezier path and extract just the path string
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  
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
        x={(sourceX + targetX) / 2 - 10}
        y={(sourceY + targetY) / 2 - 10}
        className="flow-connection-delete-btn"
      >
        <div className="flex items-center justify-center w-full h-full">
          <button
            className="w-5 h-5 rounded-full bg-white border border-gray-200 text-gray-400 flex items-center justify-center hover:bg-gray-100 hover:text-gray-600 transition-colors"
            onClick={(event) => {
              event.stopPropagation();
              const edges = document.querySelectorAll(`.react-flow__edge[data-id="${id}"]`);
              edges.forEach(edge => edge.remove());
            }}
          >
            ×
          </button>
        </div>
      </foreignObject>
    </>
  );
};

export default FlowConnector;
