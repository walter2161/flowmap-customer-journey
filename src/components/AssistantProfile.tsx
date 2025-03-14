
import React, { useState, useRef, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UserCog } from "lucide-react";
import { AssistantProfile as AssistantProfileType } from '@/utils/flowTypes';

// Default profile
const defaultProfile: AssistantProfileType = {
  name: "Assistente Virtual",
  profession: "Atendente",
  company: "Minha Empresa",
  contacts: "assistente@empresa.com",
  avatar: "",
  guidelines: "Este assistente deve ser cordial e respeitoso. Deve fornecer informações precisas e úteis. Não deve usar linguagem inapropriada ou compartilhar informações sensíveis."
};

interface AssistantProfileProps {
  initialProfile?: AssistantProfileType | null;
}

const AssistantProfile: React.FC<AssistantProfileProps> = ({ initialProfile }) => {
  // Load saved profile data from localStorage or use initialProfile or default
  const [profile, setProfile] = useState<AssistantProfileType>(() => {
    if (initialProfile) return initialProfile;
    
    const savedProfile = localStorage.getItem('assistantProfile');
    return savedProfile ? JSON.parse(savedProfile) : defaultProfile;
  });
  
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update profile when initialProfile changes
  useEffect(() => {
    if (initialProfile) {
      setProfile(initialProfile);
    }
  }, [initialProfile]);
  
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
    
    // Dispatch custom event to notify other components
    const event = new Event('profileUpdated');
    window.dispatchEvent(event);
  }, [profile]);
  
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
    <>
      <Button 
        variant="outline" 
        size="icon" 
        className="rounded-full bg-primary/10 hover:bg-primary/20 transition-colors" 
        onClick={() => setIsOpen(true)}
        title="Perfil do Assistente"
      >
        <Avatar className="h-9 w-9 border-2 border-primary/30">
          {profile.avatar ? (
            <AvatarImage src={profile.avatar} alt={profile.name} />
          ) : (
            <AvatarFallback className="bg-primary/10 text-primary">
              {getInitials(profile.name)}
            </AvatarFallback>
          )}
        </Avatar>
      </Button>
      
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="sm:max-w-md overflow-auto">
          <SheetHeader>
            <SheetTitle>Perfil do Assistente</SheetTitle>
            <SheetDescription>
              Configure as informações e diretrizes do seu assistente virtual
            </SheetDescription>
          </SheetHeader>
          
          <div className="mt-6 space-y-6">
            <div className="flex flex-col items-center">
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
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
              <Button onClick={handleSave}>Salvar e Exportar Diretrizes</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default AssistantProfile;
