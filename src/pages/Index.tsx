
import React, { useState, useEffect } from 'react';
import FlowEditor from '@/components/FlowEditor';
import AssistantCard from '@/components/AssistantCard';
import { initialFlowData } from '@/utils/initialData';
import { FlowCard, FlowData } from '@/utils/flowTypes';
import { nanoid } from 'nanoid';

const Index = () => {
  const [assistantCard, setAssistantCard] = useState<FlowCard | null>(null);
  const [flowData, setFlowData] = useState(initialFlowData);

  // Check if assistant card exists in the initial data
  useEffect(() => {
    const existingAssistantCard = flowData.cards.find(card => card.type === 'assistente');
    
    if (existingAssistantCard) {
      setAssistantCard(existingAssistantCard);
    } else {
      // Create a default assistant card if none exists
      const newAssistantCard: FlowCard = {
        id: `assistant-${nanoid(6)}`,
        title: 'Perfil do Assistente',
        description: 'Informações e diretrizes do assistente virtual',
        content: 'Configure o perfil completo do assistente virtual aqui',
        position: { x: 300, y: -100 },
        type: 'assistente',
        fields: {
          nome: 'Assistente Virtual',
          profissao: 'Atendente',
          empresa: 'Minha Empresa',
          diretrizes: 'Seja cordial e responda de forma clara e objetiva.',
          restricoes: 'Não forneça informações confidenciais ou falsas.',
          email: 'assistente@empresa.com.br',
          telefone: '(11) 99999-9999',
          avatar: ''
        }
      };
      
      setAssistantCard(newAssistantCard);
      
      // Add the assistant card to the flow data
      setFlowData(prev => ({
        ...prev,
        cards: [newAssistantCard, ...prev.cards]
      }));
    }
  }, []);

  // Handle updates to the assistant card from the card editor
  const handleAssistantUpdate = (updatedCard: FlowCard) => {
    setAssistantCard(updatedCard);
    
    // Update the assistant card in flow data
    setFlowData(prev => ({
      ...prev,
      cards: prev.cards.map(card => 
        card.id === updatedCard.id ? updatedCard : card
      )
    }));
  };

  // Handle updates to the flow editor
  const handleFlowDataChange = (newFlowData: FlowData) => {
    setFlowData(newFlowData);
    
    // Update assistant card if it was changed
    const updatedAssistantCard = newFlowData.cards.find(card => card.type === 'assistente');
    if (updatedAssistantCard) {
      setAssistantCard(updatedAssistantCard);
    }
  };
  
  return (
    <div className="w-full h-screen overflow-hidden">
      <header className="absolute top-0 left-0 right-0 z-10 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto py-4 px-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Criador de Fluxo de Atendimento</h1>
            <p className="text-sm text-gray-500">Crie e edite fluxos de atendimento para sua empresa</p>
          </div>
        </div>
      </header>
      
      <main className="w-full h-full pt-20">
        {assistantCard && (
          <div className="px-6 mb-4">
            <AssistantCard 
              data={assistantCard} 
              onUpdate={handleAssistantUpdate}
            />
          </div>
        )}
        <FlowEditor 
          initialData={flowData} 
          onFlowChange={handleFlowDataChange} 
        />
      </main>
    </div>
  );
};

export default Index;
