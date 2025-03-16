
import React, { useState, useEffect } from 'react';
import FlowEditor from '@/components/FlowEditor';
import { getTemplateData } from '@/utils/templateData';
import { AuthCheck } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut, Bot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ChatPreview from '@/components/modals/ChatPreview';

const Index = () => {
  // Use o template do Salão de Beleza como dados iniciais
  const initialData = getTemplateData('salao');
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);
  
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
                onClick={() => setIsChatOpen(true)} 
                className="gap-2"
              >
                <Bot size={16} />
                Chatbot IA
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
          scriptContent={initialData.scriptContent || "Sem roteiro disponível."} 
        />
      </div>
    </AuthCheck>
  );
};

export default Index;
