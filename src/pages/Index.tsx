
import React from 'react';
import FlowEditor from '@/components/FlowEditor';
import { initialFlowData } from '@/utils/initialData';

const Index = () => {
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
      
      <main className="w-full h-full pt-20 bg-gray-100">
        <FlowEditor initialData={initialFlowData} />
      </main>
    </div>
  );
};

export default Index;
