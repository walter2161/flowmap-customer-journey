
import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { FlowCard } from '@/utils/flowTypes';
import { PlusCircle, MinusCircle, Circle } from 'lucide-react';

interface FlowCardProps {
  data: FlowCard;
  selected: boolean;
}

const cardTypeClasses = {
  initial: 'bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-flow-initial',
  regular: 'bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-flow-regular',
  end: 'bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-flow-end'
};

const cardTypeHeaders = {
  initial: 'bg-flow-initial text-white',
  regular: 'bg-flow-regular text-white',
  end: 'bg-flow-end text-white'
};

const FlowCardComponent: React.FC<FlowCardProps> = ({ data, selected }) => {
  return (
    <div
      className={`w-[300px] rounded-xl shadow-lg transition-all duration-300 overflow-hidden flow-card-appear ${
        cardTypeClasses[data.type]
      } ${selected ? 'ring-2 ring-blue-400 shadow-xl' : ''}`}
    >
      {/* Top handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="connector-handle !bg-flow-initial !border-white top-[-8px]"
      />
      
      {/* Header */}
      <div className={`p-3 ${cardTypeHeaders[data.type]}`}>
        <h3 className="font-bold text-center uppercase tracking-wide">
          {data.title}
        </h3>
      </div>
      
      {/* Body */}
      <div className="p-4 bg-white/90 backdrop-blur-sm">
        <div className="mb-3">
          <p className="text-xs uppercase text-gray-500 font-semibold tracking-wide">Descrição</p>
          <p className="text-sm text-gray-800">{data.description}</p>
        </div>
        
        <div className="mt-3">
          <p className="text-xs uppercase text-gray-500 font-semibold tracking-wide">Conteúdo</p>
          <p className="text-sm text-gray-800">{data.content}</p>
        </div>
      </div>
      
      {/* Connector handles */}
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 flex flex-col gap-2 mr-[-12px]">
        {/* Positive handle */}
        <div className="relative group">
          <Handle
            id="positive"
            type="source"
            position={Position.Right}
            className="connector-handle !bg-flow-positive !border-white"
          />
          <div className="absolute right-[-30px] opacity-0 group-hover:opacity-100 transition-opacity">
            <PlusCircle className="w-4 h-4 text-flow-positive" />
          </div>
        </div>
        
        {/* Negative handle */}
        <div className="relative group">
          <Handle
            id="negative"
            type="source"
            position={Position.Right}
            className="connector-handle !bg-flow-negative !border-white"
          />
          <div className="absolute right-[-30px] opacity-0 group-hover:opacity-100 transition-opacity">
            <MinusCircle className="w-4 h-4 text-flow-negative" />
          </div>
        </div>
      </div>
      
      {/* Left handle */}
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 ml-[-12px]">
        <div className="relative group">
          <Handle
            type="target"
            position={Position.Left}
            className="connector-handle !bg-gray-400 !border-white"
          />
          <div className="absolute left-[-30px] opacity-0 group-hover:opacity-100 transition-opacity">
            <Circle className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(FlowCardComponent);
