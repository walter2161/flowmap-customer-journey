import React, { useState, useEffect } from 'react';
import FlowEditor from '@/components/FlowEditor';
import { getTemplateData } from '@/utils/templateData';
import { AuthCheck } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut, MessageSquare, Table } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ChatPreview from '@/components/modals/ChatPreview';
import WhatsAppSync from '@/components/modals/WhatsAppSync';

const Index = () => {
  // Use o template do Salão de Beleza como dados iniciais
  const initialData = getTemplateData('salao');
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isWhatsAppSyncOpen, setIsWhatsAppSyncOpen] = useState(false);
  
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('loginTime');
    navigate('/login');
  };
  
  return (
    <AuthCheck>
      <div className="w-full h-screen overflow-hidden bg-gray-100">
        <header className="absolute top-0 left-0 right-0 z-10 bg-white/80 backdrop-blur-md shadow-sm">
          <div className="container mx-auto py-4 px-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">Criador de Fluxo de Atendimento</h1>
              <p className="text-sm text-gray-500">Crie e edite fluxos de atendimento para sua empresa</p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsWhatsAppSyncOpen(true)} 
                className="gap-2"
              >
                <MessageSquare size={16} className="text-green-600" />
                Sincronizar WhatsApp
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsChatOpen(true)} 
                className="gap-2"
              >
                <span className="relative flex h-2 w-2 mr-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                </span>
                Chatbot IA
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                id="google-sheets-btn"
                className="gap-2"
              >
                <Table size={16} className="text-blue-600" />
                Google Sheets
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
                <LogOut size={16} />
                Sair
              </Button>
            </div>
          </div>
        </header>
        
        <main className="w-full h-full pt-20 bg-gray-100">
          <FlowEditor initialData={initialData} />
        </main>
        
        <ChatPreview 
          isOpen={isChatOpen} 
          onOpenChange={setIsChatOpen} 
          scriptContent={initialData ? generateScriptFromData(initialData) : "Sem roteiro disponível."} 
        />
        
        <WhatsAppSync
          isOpen={isWhatsAppSyncOpen}
          onOpenChange={setIsWhatsAppSyncOpen}
        />
      </div>
    </AuthCheck>
  );
};

// Helper function to generate script content from flow data
const generateScriptFromData = (data) => {
  if (!data || !data.cards || data.cards.length === 0) {
    return "Sem roteiro disponível.";
  }

  // Create a simple script based on the flow data cards
  let script = "# Roteiro de Atendimento\n\n";
  
  // Add profile info if available
  if (data.profile) {
    script += `## Assistente: ${data.profile.name}\n`;
    script += `Empresa: ${data.profile.company}\n`;
    script += `Função: ${data.profile.profession}\n\n`;
  }
  
  // Add each card to the script with their positions
  data.cards.forEach(card => {
    script += `## ${card.title}\n`;
    
    // Add position information with precise formatting
    if (card.position) {
      script += `**Posição:** x: ${typeof card.position.x === 'number' ? card.position.x.toFixed(2) : 0}, `;
      script += `y: ${typeof card.position.y === 'number' ? card.position.y.toFixed(2) : 0}\n`;
    }
    
    if (card.description) script += `${card.description}\n`;
    if (card.content) script += `${card.content}\n\n`;
    
    // Add fields if present
    if (card.fields && Object.keys(card.fields).length > 0) {
      Object.entries(card.fields).forEach(([key, value]) => {
        if (value) script += `- ${key}: ${value}\n`;
      });
      script += '\n';
    }
  });
  
  return script;
}

export default Index;
