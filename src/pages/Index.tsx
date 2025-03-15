
import React, { useEffect } from 'react';
import FlowEditor from '@/components/FlowEditor';
import { getTemplateData } from '@/utils/templateData';
import { AuthCheck } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  // Use the Beauty Salon template as the default initial data
  const initialData = getTemplateData('salao');
  const navigate = useNavigate();
  
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
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
              <LogOut size={16} />
              Sair
            </Button>
          </div>
        </header>
        
        <main className="w-full h-full pt-20 bg-gray-100">
          <FlowEditor initialData={initialData} />
        </main>
      </div>
    </AuthCheck>
  );
};

export default Index;
