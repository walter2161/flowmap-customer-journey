import React, { useCallback } from 'react';
import { EdgeProps, getBezierPath, EdgeLabelRenderer } from 'reactflow';
import { X } from 'lucide-react';

// Fix the cardTypeColors object by adding the missing 'profile' property
const cardTypeColors = {
  initial: '#32CD32',
  regular: '#424242',
  end: '#6200EA',
  imovel: '#FFA000',
  servico: '#9C27B0',
  produto: '#00BCD4',
  'multipla-escolha': '#FFEB3B',
  'pergunta-respostas': '#CDDC39',
  contatos: '#3F51B5',
  agendar: '#E91E63',
  'ordem-servico': '#009688',
  briefing: '#FF9800',
  acao: '#00C853',
  html: '#607D8B',
  'imovel-lancamento': '#EC407A',
  'imovel-usado': '#7E57C2',
  'imovel-comercial': '#29B6F6',
  'agendar-visita': '#D500F9',
  'agendar-reuniao': '#CDDC39',
  confirmacao: '#32CD32',
  documentacao: '#1E88E5',
  duvidas: '#FFEB3B',
  detalhes: '#9C27B0',
  orcamento: '#009688',
  carrinho: '#3F51B5',
  checkout: '#32CD32',
  pedido: '#FF9800',
  problema: '#FF4136',
  solucoes: '#CDDC39',
  chamado: '#E91E63',
  faq: '#607D8B',
  arquivo: '#1E88E5',
  profile: '#9C27B0'  // Added the missing profile property
};

// Define connection types and their colors
const connectionColors = {
  positive: '#32CD32',
  negative: '#FF4136',
  neutral: '#1E88E5'
};

// Custom edge component
const FlowConnector = ({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd,
  style = {},
  selected,
  animated,
  sourceHandleId,
  targetHandleId,
  interactionWidth = 20,
  ...props
}: EdgeProps) => {
  // Get the connection type from the source handle ID
  const connectionType = sourceHandleId?.split('-')[0] || 'neutral';
  
  // Get the color based on the connection type
  const color = connectionColors[connectionType as keyof typeof connectionColors] || connectionColors.neutral;
  
  // Calculate the path
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  
  // Handle edge removal
  const onEdgeClick = useCallback((evt: React.MouseEvent, id: string) => {
    evt.stopPropagation();
    props.onEdgeClick?.(evt, id);
  }, [props]);
  
  // Custom edge style
  const edgeStyle = {
    ...style,
    stroke: color,
    strokeWidth: selected ? 4 : 3,
    strokeDasharray: animated ? '5,5' : undefined,
    animation: animated ? 'flowLineDash 0.5s linear infinite' : undefined,
    filter: selected ? 'drop-shadow(0 0 5px rgba(0, 0, 0, 0.3))' : undefined,
  };
  
  return (
    <>
      <path
        id={id}
        className="flow-connection"
        d={edgePath}
        style={edgeStyle}
        markerEnd={markerEnd}
        markerStart=""
        fill="none"
      />
      
      {/* Edge interaction area (invisible, wider path for easier interaction) */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={interactionWidth}
        style={{ cursor: 'pointer' }}
        onClick={(event) => onEdgeClick(event, id)}
      />
      
      {/* Edge label and delete button */}
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          className="nodrag nopan"
        >
          {/* Delete button */}
          <button
            className="flow-connection-delete-btn bg-white rounded-full p-1 shadow-md hover:bg-red-50 transition-colors"
            onClick={(event) => onEdgeClick(event, id)}
          >
            <X size={14} className="text-red-500" />
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default FlowConnector;
