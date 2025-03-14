
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Phone, Briefcase, Building, Edit, X, Save } from 'lucide-react';
import { FlowCard } from '@/utils/flowTypes';
import { Button } from '@/components/ui/button';

interface AssistantCardProps {
  data: FlowCard;
  onUpdate?: (updatedData: FlowCard) => void;
}

const AssistantCard: React.FC<AssistantCardProps> = ({ data, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({ ...data });
  const { fields } = data;
  
  if (!fields) return null;

  const handleInputChange = (key: string, value: any) => {
    setEditedData({
      ...editedData,
      fields: {
        ...editedData.fields,
        [key]: value
      }
    });
  };

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(editedData);
    }
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setEditedData({ ...data });
    setIsEditing(false);
  };
  
  return (
    <Card className={`w-full ${data.id ? 'max-w-full' : 'max-w-2xl mx-auto mb-6'} border-slate-300 shadow-md bg-white relative`}>
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-800"></div>
      <CardHeader className="pb-2 flex flex-row justify-between">
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
        {!isEditing ? (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsEditing(true)}
            className="ml-auto"
          >
            <Edit size={14} className="mr-1" /> Editar
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCancel}
            >
              <X size={14} className="mr-1" /> Cancelar
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              onClick={handleSave}
            >
              <Save size={14} className="mr-1" /> Salvar
            </Button>
          </div>
        )}
      </CardHeader>
      {!isEditing ? (
        <>
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
        </>
      ) : (
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Nome</label>
                <input
                  type="text"
                  value={editedData.fields?.nome || ''}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Profissão</label>
                <input
                  type="text"
                  value={editedData.fields?.profissao || ''}
                  onChange={(e) => handleInputChange('profissao', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Empresa</label>
                <input
                  type="text"
                  value={editedData.fields?.empresa || ''}
                  onChange={(e) => handleInputChange('empresa', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
                <input
                  type="email"
                  value={editedData.fields?.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Telefone</label>
                <input
                  type="text"
                  value={editedData.fields?.telefone || ''}
                  onChange={(e) => handleInputChange('telefone', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Avatar URL</label>
                <input
                  type="text"
                  value={editedData.fields?.avatar || ''}
                  onChange={(e) => handleInputChange('avatar', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Diretrizes</label>
              <textarea
                value={editedData.fields?.diretrizes || ''}
                onChange={(e) => handleInputChange('diretrizes', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={4}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Restrições</label>
              <textarea
                value={editedData.fields?.restricoes || ''}
                onChange={(e) => handleInputChange('restricoes', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={4}
              />
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default AssistantCard;
