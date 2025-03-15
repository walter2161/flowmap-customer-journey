
import React from 'react';
import { EdgeProps, getSmoothStepPath, useReactFlow } from 'reactflow';
import { ConnectionType } from '@/utils/flowTypes';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface FlowConnectorProps extends EdgeProps {
  data?: {
    type: ConnectionType;
    sourcePortLabel?: string;
  };
  sourceHandle?: string;
}

// All connection lines will be black now
const connectionColors = {
  positive: '#333333', // Black
  negative: '#333333', // Black
  neutral: '#333333',  // Black
  custom: '#333333'    // Black
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
  sourceHandle,
  source,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const { setEdges } = useReactFlow();

  // Default to custom connection type for new system
  let connectionType: ConnectionType = 'custom';
  
  // For backward compatibility with older connection types
  if (data?.type) {
    connectionType = data.type;
  } else if (sourceHandle === 'positive') {
    connectionType = 'positive';
  } else if (sourceHandle === 'negative') {
    connectionType = 'negative';
  }
  
  const strokeColor = connectionColors[connectionType];
  
  // Get the smooth step path with rounded corners
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 16, // Set to a higher value for rounded corners
  });

  const handleDelete = () => {
    setEdges(edges => edges.filter(edge => edge.id !== id));
    setShowDeleteConfirm(false);
  };
  
  // Determine if we have a port label (intenção do usuário)
  const hasPortLabel = data?.sourcePortLabel && data.sourcePortLabel.trim() !== '';
  
  // Label position calculation
  const labelX = (sourceX + targetX) / 2;
  const labelY = (sourceY + targetY) / 2 - 20; // Move label above the line
  
  return (
    <>
      <path
        id={id}
        className="flow-connection"
        d={edgePath}
        style={{
          stroke: strokeColor,
          strokeWidth: 3,
          strokeLinecap: 'round', // Changed back to 'round' for smoother appearance
          fill: 'none',
          zIndex: 1000,
        }}
      />
      
      {/* Connection label showing the user intention */}
      {hasPortLabel && (
        <foreignObject
          width={150}
          height={30}
          x={labelX - 75}
          y={labelY - 15}
          className="flow-connection-label"
          style={{ zIndex: 1001 }}
        >
          <div 
            className="px-2 py-1 bg-white border border-gray-200 rounded-md text-xs text-center text-gray-700 shadow-sm overflow-hidden text-ellipsis whitespace-nowrap"
            style={{ maxWidth: '150px' }}
          >
            {data.sourcePortLabel}
          </div>
        </foreignObject>
      )}
      
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
              setShowDeleteConfirm(true);
            }}
          >
            ×
          </button>
        </div>
      </foreignObject>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Conexão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta conexão? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default FlowConnector;
