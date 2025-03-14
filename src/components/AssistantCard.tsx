
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Phone, Briefcase, Building } from 'lucide-react';
import { FlowCard } from '@/utils/flowTypes';

interface AssistantCardProps {
  data: FlowCard;
}

const AssistantCard: React.FC<AssistantCardProps> = ({ data }) => {
  const { fields } = data;
  
  if (!fields) return null;
  
  return (
    <Card className="w-full max-w-2xl mx-auto mb-6 border-blue-500 shadow-md bg-white">
      <CardHeader className="pb-2">
        <div className="flex items-start gap-4">
          {fields.avatar ? (
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-500 flex-shrink-0">
              <img 
                src={fields.avatar} 
                alt={`Avatar de ${fields.nome || 'Assistente'}`} 
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-500 flex-shrink-0">
              <User size={32} className="text-blue-500" />
            </div>
          )}
          <div>
            <CardTitle className="text-xl text-blue-700">{fields.nome || 'Assistente Virtual'}</CardTitle>
            <div className="flex items-center text-gray-600 mt-1">
              <Briefcase size={16} className="mr-1" />
              <span className="text-sm">{fields.profissao || 'Atendente'}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Building size={16} className="mr-1" />
              <span className="text-sm">{fields.empresa || 'Empresa'}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-medium text-blue-700 mb-1">Diretrizes</h3>
            <p className="text-sm text-gray-700 whitespace-pre-line">{fields.diretrizes || 'Sem diretrizes definidas.'}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-blue-700 mb-1">Restrições</h3>
            <p className="text-sm text-gray-700 whitespace-pre-line">{fields.restricoes || 'Sem restrições definidas.'}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-2 text-sm text-gray-600">
        <div className="flex items-center">
          <Mail size={14} className="mr-1" />
          <span>{fields.email || 'assistente@empresa.com'}</span>
        </div>
        <div className="flex items-center">
          <Phone size={14} className="mr-1" />
          <span>{fields.telefone || '(00) 0000-0000'}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AssistantCard;
