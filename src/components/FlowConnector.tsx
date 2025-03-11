
import React from 'react';
import { EdgeProps, useReactFlow } from 'reactflow';
import { ConnectionType } from '@/utils/flowTypes';

interface FlowConnectorProps extends EdgeProps {
  data?: {
    type: ConnectionType;
  };
}

const connectionColors = {
  positive: '#10B981',
  negative: '#EF4444',
  neutral: '#6B7280'
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
  
  const startX = sourceX;
  const startY = sourceY;
  const endX = targetX;
  const endY = targetY;
  const offsetX = Math.abs(endX - startX) * 0.5;
  
  const path = `
    M ${startX} ${startY}
    C ${startX + offsetX} ${startY}, ${endX - offsetX} ${endY}, ${endX} ${endY}
  `;

  const handleDelete = () => {
    setEdges(edges => edges.filter(edge => edge.id !== id));
  };
  
  return (
    <>
      <path
        id={id}
        className="flow-connection"
        style={{
          ...style,
          stroke: strokeColor,
          strokeWidth: 3,
          strokeLinecap: 'round',
          fill: 'none'
        }}
        d={path}
      />
      
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
            onClick={handleDelete}
          >
            ×
          </button>
        </div>
      </foreignObject>
    </>
  );
};

export default FlowConnector;
