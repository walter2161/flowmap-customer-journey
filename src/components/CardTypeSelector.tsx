
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export type CardType = 'initial' | 'regular' | 'end' | 'property' | 'service' | 'product' | 'action' | 'multiple' | 'payment' | 'scheduling' | 'qa' | 'contact';

interface CardTypeOption {
  type: CardType;
  label: string;
  description: string;
  icon: string;
}

const cardTypes: CardTypeOption[] = [
  { type: 'initial', label: 'Inicial', description: 'Ponto de início do fluxo', icon: '🚀' },
  { type: 'regular', label: 'Regular', description: 'Cartão padrão de fluxo', icon: '📝' },
  { type: 'end', label: 'Final', description: 'Ponto de conclusão', icon: '🏁' },
  { type: 'property', label: 'Imóvel', description: 'Detalhes de propriedade', icon: '🏠' },
  { type: 'service', label: 'Serviço', description: 'Descrição de serviço', icon: '🛠️' },
  { type: 'product', label: 'Produto', description: 'Informações de produto', icon: '📦' },
  { type: 'action', label: 'Ação', description: 'Ação específica', icon: '⚡' },
  { type: 'multiple', label: 'Múltipla Escolha', description: 'Opções múltiplas', icon: '📋' },
  { type: 'payment', label: 'Pagamento', description: 'Informações de pagamento', icon: '💳' },
  { type: 'scheduling', label: 'Agendamento', description: 'Marcar horário/data', icon: '📅' },
  { type: 'qa', label: 'Perguntas e Respostas', description: 'FAQ e suporte', icon: '❓' },
  { type: 'contact', label: 'Contato', description: 'Informações de contato', icon: '📞' }
];

interface CardTypeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: CardType) => void;
}

const CardTypeSelector: React.FC<CardTypeSelectorProps> = ({ isOpen, onClose, onSelect }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Selecione o Tipo de Cartão</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
          {cardTypes.map((cardType) => (
            <button
              key={cardType.type}
              onClick={() => onSelect(cardType.type)}
              className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <span className="text-2xl mb-2">{cardType.icon}</span>
              <h3 className="font-semibold">{cardType.label}</h3>
              <p className="text-sm text-gray-600">{cardType.description}</p>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CardTypeSelector;
