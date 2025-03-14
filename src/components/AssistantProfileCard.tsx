
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { FlowCard } from '@/utils/flowTypes';
import { PencilIcon, User, Phone, Mail, Building } from 'lucide-react';

interface AssistantProfileCardProps {
  data: FlowCard;
  isConnectable: boolean;
  selected: boolean;
  onCardUpdate?: (cardId: string, cardData: FlowCard) => void;
}

const AssistantProfileCard: React.FC<AssistantProfileCardProps> = ({ 
  data, 
  selected,
  onCardUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [cardData, setCardData] = useState<FlowCard>(data);
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleSave = () => {
    setIsEditing(false);
    if (onCardUpdate) {
      onCardUpdate(data.id, cardData);
    }
  };
  
  const handleChange = (key: string, value: any) => {
    setCardData({
      ...cardData,
      fields: {
        ...cardData.fields,
        [key]: value
      }
    });
  };
  
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCardData({
      ...cardData,
      content: e.target.value
    });
  };
  
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Create a canvas to resize the image
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 350;
        const MAX_HEIGHT = 350;
        let width = img.width;
        let height = img.height;

        // Calculate the new dimensions while maintaining aspect ratio
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        // Convert to base64 with reduced quality
        const base64 = canvas.toDataURL('image/jpeg', 0.8);
        handleChange('avatar', base64);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };
  
  return (
    <Card className={`w-[350px] overflow-hidden border-2 ${selected ? 'border-blue-500' : 'border-gray-200'}`}>
      <div className="bg-black text-white p-2 flex justify-between items-center">
        <h3 className="text-lg font-medium">{cardData.title}</h3>
        <button 
          onClick={isEditing ? handleSave : handleEdit}
          className="p-1 rounded-full hover:bg-gray-700 transition-colors"
        >
          {isEditing ? (
            <span className="text-xs">Salvar</span>
          ) : (
            <PencilIcon size={16} />
          )}
        </button>
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-center space-x-4 mb-4">
          <div className="relative">
            {isEditing ? (
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
                <Avatar className="w-20 h-20 border-2 border-gray-300 cursor-pointer hover:opacity-80">
                  {cardData.fields?.avatar ? (
                    <AvatarImage src={cardData.fields.avatar} alt="Avatar" />
                  ) : (
                    <AvatarFallback className="bg-gray-200 text-gray-700">
                      <User size={32} />
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 text-white text-xs rounded-full opacity-0 hover:opacity-100">
                  Alterar
                </div>
              </label>
            ) : (
              <Avatar className="w-20 h-20 border-2 border-gray-300">
                {cardData.fields?.avatar ? (
                  <AvatarImage src={cardData.fields.avatar} alt="Avatar" />
                ) : (
                  <AvatarFallback className="bg-gray-200 text-gray-700">
                    <User size={32} />
                  </AvatarFallback>
                )}
              </Avatar>
            )}
          </div>
          
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={cardData.fields?.name || ''}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Nome do Assistente"
                  className="w-full p-1 border border-gray-300 rounded text-sm"
                />
                <input
                  type="text"
                  value={cardData.fields?.profession || ''}
                  onChange={(e) => handleChange('profession', e.target.value)}
                  placeholder="Profissão"
                  className="w-full p-1 border border-gray-300 rounded text-sm"
                />
              </div>
            ) : (
              <div>
                <h4 className="font-bold text-lg">{cardData.fields?.name || 'Assistente Virtual'}</h4>
                <p className="text-sm text-gray-600">{cardData.fields?.profession || 'Atendente Virtual'}</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          {isEditing ? (
            <>
              <div className="flex items-center space-x-2">
                <Building size={16} className="text-gray-500" />
                <input
                  type="text"
                  value={cardData.fields?.company || ''}
                  onChange={(e) => handleChange('company', e.target.value)}
                  placeholder="Empresa"
                  className="w-full p-1 border border-gray-300 rounded text-sm"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Mail size={16} className="text-gray-500" />
                <input
                  type="email"
                  value={cardData.fields?.email || ''}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="Email"
                  className="w-full p-1 border border-gray-300 rounded text-sm"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Phone size={16} className="text-gray-500" />
                <input
                  type="text"
                  value={cardData.fields?.phone || ''}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="Telefone"
                  className="w-full p-1 border border-gray-300 rounded text-sm"
                />
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center space-x-2">
                <Building size={16} className="text-gray-500" />
                <span className="text-sm">{cardData.fields?.company || 'Minha Empresa'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail size={16} className="text-gray-500" />
                <span className="text-sm">{cardData.fields?.email || 'assistente@empresa.com'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone size={16} className="text-gray-500" />
                <span className="text-sm">{cardData.fields?.phone || '(00) 00000-0000'}</span>
              </div>
            </>
          )}
        </div>
        
        <div className="mb-4">
          <h4 className="font-medium text-sm mb-1">Descrição:</h4>
          {isEditing ? (
            <textarea
              value={cardData.content}
              onChange={handleContentChange}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              rows={2}
            />
          ) : (
            <p className="text-sm text-gray-700">{cardData.content}</p>
          )}
        </div>
        
        <div className="mb-4">
          <h4 className="font-medium text-sm mb-1">Diretrizes:</h4>
          {isEditing ? (
            <textarea
              value={cardData.fields?.guidelines || ''}
              onChange={(e) => handleChange('guidelines', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              rows={5}
            />
          ) : (
            <div className="text-sm text-gray-700 whitespace-pre-line border p-2 rounded max-h-32 overflow-y-auto">
              {cardData.fields?.guidelines || 'Sem diretrizes definidas.'}
            </div>
          )}
        </div>
        
        <div>
          <h4 className="font-medium text-sm mb-1">Proibições:</h4>
          {isEditing ? (
            <textarea
              value={cardData.fields?.prohibitions || ''}
              onChange={(e) => handleChange('prohibitions', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              rows={5}
            />
          ) : (
            <div className="text-sm text-gray-700 whitespace-pre-line border p-2 rounded max-h-32 overflow-y-auto">
              {cardData.fields?.prohibitions || 'Sem proibições definidas.'}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AssistantProfileCard;
