
import React, { useState, useEffect } from 'react';
import { UserCog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';

// Template types
type Template = 'default' | 'support' | 'sales' | 'finance';

// Default profiles by template
const profilesByTemplate: Record<Template, AssistantProfileData> = {
  default: {
    name: 'Assistente Padrão',
    avatar: '/placeholder.svg',
    description: 'Assistente virtual para diversas tarefas',
    language: 'Português',
    style: 'Formal',
    isActivated: true,
    useEmojis: true,
  },
  support: {
    name: 'Assistente de Suporte',
    avatar: '/placeholder.svg',
    description: 'Especialista em resolver problemas técnicos',
    language: 'Português',
    style: 'Informal',
    isActivated: true,
    useEmojis: true,
  },
  sales: {
    name: 'Assistente de Vendas',
    avatar: '/placeholder.svg',
    description: 'Especialista em vendas e atendimento ao cliente',
    language: 'Português',
    style: 'Persuasivo',
    isActivated: true,
    useEmojis: false,
  },
  finance: {
    name: 'Assistente Financeiro',
    avatar: '/placeholder.svg',
    description: 'Especialista em finanças e investimentos',
    language: 'Português',
    style: 'Técnico',
    isActivated: true,
    useEmojis: false,
  },
};

// Profile data interface
interface AssistantProfileData {
  name: string;
  avatar: string;
  description: string;
  language: string;
  style: string;
  isActivated: boolean;
  useEmojis: boolean;
}

export const AssistantProfile: React.FC = () => {
  const [template, setTemplate] = useState<Template>('default');
  const [profile, setProfile] = useState<AssistantProfileData>(profilesByTemplate.default);
  
  // Load profile data when template changes
  useEffect(() => {
    setProfile(profilesByTemplate[template]);
  }, [template]);
  
  // Handle profile data changes
  const handleProfileChange = (field: keyof AssistantProfileData, value: any) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle save button click
  const handleSaveProfile = () => {
    // Here you would save the profile data to your backend
    console.log('Saving profile:', profile);
    toast({
      title: "Perfil salvo",
      description: "Perfil do assistente atualizado com sucesso."
    });
  };
  
  // Handle template change
  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTemplate(e.target.value as Template);
  };
  
  return (
    <div className="flex flex-col gap-6 py-4">
      {/* Avatar and template selection */}
      <div className="flex flex-col items-center gap-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src={profile.avatar} alt={profile.name} />
          <AvatarFallback>{profile.name.substring(0, 2)}</AvatarFallback>
        </Avatar>
        
        <div className="w-full">
          <Label htmlFor="template">Modelo de Assistente</Label>
          <select
            id="template"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={template}
            onChange={handleTemplateChange}
          >
            <option value="default">Padrão</option>
            <option value="support">Suporte</option>
            <option value="sales">Vendas</option>
            <option value="finance">Financeiro</option>
          </select>
        </div>
      </div>
      
      {/* Profile settings */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome</Label>
          <Input 
            id="name" 
            value={profile.name} 
            onChange={(e) => handleProfileChange('name', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea 
            id="description" 
            value={profile.description}
            onChange={(e) => handleProfileChange('description', e.target.value)}
            rows={3}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="language">Idioma</Label>
          <Input 
            id="language" 
            value={profile.language}
            onChange={(e) => handleProfileChange('language', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="style">Estilo de Comunicação</Label>
          <Input 
            id="style" 
            value={profile.style}
            onChange={(e) => handleProfileChange('style', e.target.value)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="activated">Ativado</Label>
          <Switch 
            id="activated" 
            checked={profile.isActivated}
            onCheckedChange={(checked) => handleProfileChange('isActivated', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="emojis">Usar Emojis</Label>
          <Switch 
            id="emojis" 
            checked={profile.useEmojis}
            onCheckedChange={(checked) => handleProfileChange('useEmojis', checked)}
          />
        </div>
      </div>
      
      {/* Save button */}
      <Button onClick={handleSaveProfile} className="mt-4">Salvar Perfil</Button>
    </div>
  );
};
