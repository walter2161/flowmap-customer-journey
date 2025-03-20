import React from 'react';
import { EdgeProps, getSmoothStepPath, useReactFlow } from 'reactflow';
import { CardType, ConnectionType } from '@/utils/flowTypes';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface FlowConnectorProps extends EdgeProps {
  data?: {
    type: ConnectionType;
    sourcePortLabel?: string;
  };
  sourceHandle?: string;
}

// Map of card types to their colors
const cardTypeColors: Record<CardType, string> = {
  initial: '#32CD32',
  regular: '#424242',
  end: '#FF4136',
  imovel: '#3498db',
  servico: '#9b59b6',
  produto: '#f1c40f',
  'multipla-escolha': '#6610f2',
  'pergunta-respostas': '#20c997',
  contatos: '#e83e8c',
  agendar: '#fd7e14',
  'ordem-servico': '#00b8d4',
  briefing: '#cddc39',
  acao: '#ffb300',
  html: '#e91e63',
  'imovel-lancamento': '#00b0ff',
  'imovel-usado': '#00e676',
  'imovel-comercial': '#651fff',
  'agendar-visita': '#d500f9',
  'agendar-reuniao': '#64748b',
  confirmacao: '#32CD32',
  documentacao: '#3498db',
  duvidas: '#f1c40f',
  detalhes: '#9b59b6',
  orcamento: '#00b8d4',
  carrinho: '#6610f2',
  checkout: '#00e676',
  pedido: '#ffb300',
  problema: '#FF4136',
  solucoes: '#20c997',
  chamado: '#fd7e14',
  faq: '#424242',
  arquivo: '#795548',
  profile: '#8e44ad' // Adding the missing profile color
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
  target,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const { setEdges, getNode } = useReactFlow();

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
  
  // Get the target node to determine its color
  const targetNode = getNode(target);
  let strokeColor = '#333333'; // Default color
  
  if (targetNode && targetNode.data && targetNode.data.type) {
    const cardType = targetNode.data.type as CardType;
    if (cardTypeColors[cardType]) {
      strokeColor = cardTypeColors[cardType];
    }
  }
  
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
