
import React, { useState, useRef, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UserCog } from "lucide-react";
import { AssistantProfile as AssistantProfileType } from '@/utils/flowTypes';

// Perfis por template
const templateProfiles = {
  default: {
    name: "Assistente Virtual",
    profession: "Atendente",
    company: "Minha Empresa",
    contacts: "assistente@empresa.com",
    avatar: "",
    guidelines: "Este assistente deve ser cordial e respeitoso. Deve fornecer informações precisas e úteis. Não deve usar linguagem inapropriada ou compartilhar informações sensíveis."
  },
  suporte: {
    name: "Suporte Técnico",
    profession: "Analista de Suporte",
    company: "Tech Solutions",
    contacts: "suporte@techsolutions.com",
    avatar: "",
    guidelines: "Este assistente deve fornecer suporte técnico eficiente, guiando os usuários na solução de problemas de forma clara e paciente. Deve solicitar informações específicas para diagnóstico preciso e propor soluções práticas."
  },
  vendas: {
    name: "Consultor de Vendas",
    profession: "Vendedor",
    company: "Vendas Express",
    contacts: "vendas@express.com",
    avatar: "",
    guidelines: "Este assistente deve ser persuasivo e conhecer bem os produtos. Deve identificar necessidades do cliente, apresentar soluções adequadas e incentivar a compra sem ser invasivo. Deve responder dúvidas sobre preços, promoções e condições de pagamento."
  },
  financeiro: {
    name: "Analista Financeiro",
    profession: "Consultor Financeiro",
    company: "Finanças Seguras",
    contacts: "financeiro@seguras.com",
    avatar: "",
    guidelines: "Este assistente deve fornecer orientações financeiras claras e profissionais. Deve manter sigilo das informações sensíveis e verificar a identidade do usuário antes de compartilhar dados. Não deve dar conselhos de investimento específicos sem as devidas ressalvas legais."
  }
};

const AssistantProfile = () => {
  // Estado para controlar qual template está selecionado
  const [selectedTemplate, setSelectedTemplate] = useState("default");
  
  // Load saved profile data from localStorage or use template default
  const [profile, setProfile] = useState<AssistantProfileType>(() => {
    const savedProfile = localStorage.getItem('assistantProfile');
    return savedProfile ? JSON.parse(savedProfile) : templateProfiles.default;
  });
  
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Function to handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Only accept image files
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas imagens.');
      return;
    }
    
    // Resize and convert to base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Maintain aspect ratio
        if (width > height) {
          if (width > 350) {
            height = height * (350 / width);
            width = 350;
          }
        } else {
          if (height > 350) {
            width = width * (350 / height);
            height = 350;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setProfile({...profile, avatar: dataUrl});
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };
  
  // Function to trigger file input click
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };
  
  // Save profile to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('assistantProfile', JSON.stringify(profile));
  }, [profile]);
  
  // Função para aplicar perfil do template
  const applyTemplateProfile = (template: string) => {
    setSelectedTemplate(template);
    const templateProfile = templateProfiles[template as keyof typeof templateProfiles] || templateProfiles.default;
    
    // Manter o avatar atual ao trocar de template
    const currentAvatar = profile.avatar;
    setProfile({...templateProfile, avatar: currentAvatar});
  };
  
  // Function to handle form submission
  const handleSave = () => {
    localStorage.setItem('assistantProfile', JSON.stringify(profile));
    setIsOpen(false);
    
    // Generate guidelines text for export
    const guidelinesText = generateGuidelinesText();
    
    // Create a downloadable file
    const blob = new Blob([guidelinesText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'diretrizes_assistente.txt';
    link.click();
    URL.revokeObjectURL(url);
  };
  
  // Function to generate guidelines text
  const generateGuidelinesText = () => {
    return `DIRETRIZES DO ASSISTENTE

Nome: ${profile.name}
Profissão: ${profile.profession}
Empresa: ${profile.company}
Contatos: ${profile.contacts}

DIRETRIZES:
${profile.guidelines}
`;
  };
  
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <div className="flex items-center justify-end py-2">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
          >
            <UserCog size={18} />
            <span>Perfil do Assistente</span>
          </Button>
        </SheetTrigger>
        
        <SheetContent className="sm:max-w-md overflow-auto">
          <SheetHeader>
            <SheetTitle>Perfil do Assistente</SheetTitle>
            <SheetDescription>
              Configure as informações e diretrizes do seu assistente virtual
            </SheetDescription>
          </SheetHeader>
          
          <div className="mt-6 space-y-6">
            {/* Template selection */}
            <div>
              <Label htmlFor="template">Modelo de Perfil</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button 
                  variant={selectedTemplate === "default" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => applyTemplateProfile("default")}
                >
                  Padrão
                </Button>
                <Button 
                  variant={selectedTemplate === "suporte" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => applyTemplateProfile("suporte")}
                >
                  Suporte
                </Button>
                <Button 
                  variant={selectedTemplate === "vendas" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => applyTemplateProfile("vendas")}
                >
                  Vendas
                </Button>
                <Button 
                  variant={selectedTemplate === "financeiro" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => applyTemplateProfile("financeiro")}
                >
                  Financeiro
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input 
                  id="name" 
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="profession">Profissão</Label>
                <Input 
                  id="profession" 
                  value={profile.profession}
                  onChange={(e) => setProfile({...profile, profession: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="company">Empresa</Label>
                <Input 
                  id="company" 
                  value={profile.company}
                  onChange={(e) => setProfile({...profile, company: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="contacts">Contatos</Label>
                <Input 
                  id="contacts" 
                  value={profile.contacts}
                  onChange={(e) => setProfile({...profile, contacts: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="guidelines">Diretrizes (O que o assistente pode e não pode fazer)</Label>
                <Textarea 
                  id="guidelines" 
                  value={profile.guidelines}
                  onChange={(e) => setProfile({...profile, guidelines: e.target.value})}
                  className="h-48"
                />
              </div>
            </div>
            
            {/* Avatar section explicitly placed above save button */}
            <div className="flex flex-col items-center mt-6 mb-6">
              <div 
                className="relative cursor-pointer group" 
                onClick={handleAvatarClick}
              >
                <Avatar className="h-24 w-24 border-2 border-primary/30">
                  {profile.avatar ? (
                    <AvatarImage src={profile.avatar} alt={profile.name} />
                  ) : (
                    <AvatarFallback className="bg-primary/10 text-primary text-xl">
                      {getInitials(profile.name)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs transition-opacity">
                  Editar
                </div>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleImageUpload} 
              />
              <p className="text-xs mt-2 text-muted-foreground">
                Clique para alterar (máx. 350px)
              </p>
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
              <Button onClick={handleSave}>Salvar e Exportar Diretrizes</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AssistantProfile;
