
import React from 'react';
import { EdgeProps, getBezierPath, useReactFlow } from 'reactflow';
import { ConnectionType } from '@/utils/flowTypes';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface FlowConnectorProps extends EdgeProps {
  data?: {
    type: ConnectionType;
    portLabel?: string;
    portLetter?: string;
  };
  sourceHandle?: string;
}

const connectionColors = {
  positive: '#10B981', // Green
  negative: '#EF4444', // Red
  neutral: '#6B7280',  // Gray
  custom: '#3B82F6'    // Blue
};

// Array de letras para identificar as portas
const portLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

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
  sourceHandleId,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const { setEdges, getNodes } = useReactFlow();

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
  
  // Get the bezier path and extract just the path string
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Get port letter based on source node and handle
  const getPortLetter = () => {
    if (!source || !sourceHandleId) return '';
    
    const nodes = getNodes();
    const sourceNode = nodes.find(node => node.id === source);
    if (!sourceNode || !sourceNode.data || !sourceNode.data.outputPorts) return '';
    
    const portIndex = sourceNode.data.outputPorts.findIndex(port => port.id === sourceHandleId);
    if (portIndex === -1) return '';
    
    return portIndex < portLetters.length ? portLetters[portIndex] : '#';
  };

  const portLetter = getPortLetter();

  const handleDelete = () => {
    setEdges(edges => edges.filter(edge => edge.id !== id));
    setShowDeleteConfirm(false);
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
      
      {/* Show port label along the path */}
      {(data?.portLabel || portLetter) && (
        <foreignObject
          width={140}
          height={30}
          x={(sourceX + targetX) / 2 - 70}
          y={(sourceY + targetY) / 2 - 40}
          className="flow-connection-label"
        >
          <div className="flow-connection-label-container flex items-center justify-center">
            <span className="flex items-center px-2 py-1 bg-white/90 text-xs border border-gray-200 rounded-md shadow-sm text-gray-700">
              {portLetter && (
                <span className="inline-flex items-center justify-center bg-blue-500 text-white rounded-full w-5 h-5 text-xs mr-2">
                  {portLetter}
                </span>
              )}
              {data?.portLabel || ''}
            </span>
          </div>
        </foreignObject>
      )}
      
      {/* Connection marker at source */}
      <foreignObject
        width={20}
        height={20}
        x={sourceX - 10}
        y={sourceY - 10}
        className="connection-source-marker"
      >
        <div className="flex items-center justify-center w-full h-full">
          <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white bg-blue-500">
            {portLetter || ''}
          </div>
        </div>
      </foreignObject>
      
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
