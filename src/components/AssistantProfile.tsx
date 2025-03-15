import React, { useState, useRef, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UserCog, BookText, Plus, Minus } from "lucide-react";
import { AssistantProfile as AssistantProfileType } from '@/utils/flowTypes';
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Default profile
const defaultProfile: AssistantProfileType = {
  name: "Assistente Virtual",
  profession: "Atendente",
  company: "Minha Empresa",
  contacts: "assistente@empresa.com",
  avatar: "",
  guidelines: "Este assistente deve ser cordial e respeitoso. Deve fornecer informações precisas e úteis. Não deve usar linguagem inapropriada ou compartilhar informações sensíveis.",
  scriptGuidelines: [
    "Sempre entender a intenção do cliente antes de responder, adaptando o fluxo conforme necessário.",
    "Navegar entre os cartões de maneira lógica, seguindo as conexões definidas no fluxo.",
    "Se o cliente fornecer uma resposta inesperada, reformular a pergunta ou redirecioná-lo para uma opção próxima.",
    "Voltar para etapas anteriores, se necessário, garantindo que o cliente tenha todas as informações antes de finalizar uma interação.",
    "Confirmar sempre que possível as escolhas do cliente para evitar erros.",
    "Encerrar a conversa de forma educada, sempre deixando um canal aberto para contato futuro."
  ]
};

interface AssistantProfileProps {
  initialProfile?: AssistantProfileType | null;
}

const AssistantProfile: React.FC<AssistantProfileProps> = ({ initialProfile }) => {
  const { toast } = useToast();
  
  // Load saved profile data from localStorage or use initialProfile or default
  const [profile, setProfile] = useState<AssistantProfileType>(() => {
    if (initialProfile) return initialProfile;
    
    const savedProfile = localStorage.getItem('assistantProfile');
    return savedProfile ? JSON.parse(savedProfile) : defaultProfile;
  });
  
  // Add missing scriptGuidelines if they don't exist
  useEffect(() => {
    if (!profile.scriptGuidelines) {
      setProfile(prev => ({
        ...prev,
        scriptGuidelines: defaultProfile.scriptGuidelines
      }));
    }
  }, [profile]);
  
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newGuideline, setNewGuideline] = useState("");

  // Update profile when initialProfile changes
  useEffect(() => {
    if (initialProfile) {
      // Add scriptGuidelines if they don't exist in the initialProfile
      const updatedProfile = {
        ...initialProfile,
        scriptGuidelines: initialProfile.scriptGuidelines || defaultProfile.scriptGuidelines
      };
      setProfile(updatedProfile);
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
    const event = new CustomEvent('profileUpdated', { detail: profile });
    window.dispatchEvent(event);
  }, [profile]);
  
  // Function to handle form submission
  const handleSave = () => {
    localStorage.setItem('assistantProfile', JSON.stringify(profile));
    
    // Dispatch custom event with the updated profile
    const event = new CustomEvent('profileUpdated', { detail: profile });
    window.dispatchEvent(event);
    
    setIsOpen(false);
    
    toast({
      title: "Perfil salvo",
      description: "As informações do assistente foram salvas com sucesso!",
    });
    
    // Removed the automatic file generation and download from here
  };
  
  // Add a new script guideline
  const addScriptGuideline = () => {
    if (newGuideline.trim() === "") return;
    
    setProfile({
      ...profile,
      scriptGuidelines: [...(profile.scriptGuidelines || []), newGuideline.trim()]
    });
    
    setNewGuideline("");
  };
  
  // Remove a script guideline
  const removeScriptGuideline = (index: number) => {
    const updatedGuidelines = [...(profile.scriptGuidelines || [])];
    updatedGuidelines.splice(index, 1);
    
    setProfile({
      ...profile,
      scriptGuidelines: updatedGuidelines
    });
  };
  
  // Update a script guideline
  const updateScriptGuideline = (index: number, value: string) => {
    const updatedGuidelines = [...(profile.scriptGuidelines || [])];
    updatedGuidelines[index] = value;
    
    setProfile({
      ...profile,
      scriptGuidelines: updatedGuidelines
    });
  };
  
  // Function to generate guidelines text
  const generateGuidelinesText = () => {
    let text = `DIRETRIZES DO ASSISTENTE

Nome: ${profile.name}
Profissão: ${profile.profession}
Empresa: ${profile.company}
Contatos: ${profile.contacts}

DIRETRIZES GERAIS:
${profile.guidelines}

DIRETRIZES DE INTERPRETAÇÃO DO FLUXO:
`;

    // Add script guidelines as bullet points
    if (profile.scriptGuidelines && profile.scriptGuidelines.length > 0) {
      profile.scriptGuidelines.forEach((guideline, index) => {
        text += `- ${guideline}\n`;
      });
    }
    
    return text;
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
          
          <Tabs 
            defaultValue="profile" 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="mt-6"
          >
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="profile">Perfil</TabsTrigger>
              <TabsTrigger value="guidelines">Diretrizes de Script</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-6">
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
                  <Label htmlFor="guidelines">Diretrizes Gerais</Label>
                  <Textarea 
                    id="guidelines" 
                    value={profile.guidelines}
                    onChange={(e) => setProfile({...profile, guidelines: e.target.value})}
                    className="h-48"
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="guidelines" className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <BookText className="text-primary h-5 w-5" />
                <h3 className="text-lg font-medium">Diretrizes de Interpretação do Fluxo</h3>
              </div>
              
              <div className="space-y-4">
                {(profile.scriptGuidelines || []).map((guideline, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <Textarea 
                      value={guideline}
                      onChange={(e) => updateScriptGuideline(index, e.target.value)}
                      className="flex-1 min-h-[60px]"
                    />
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => removeScriptGuideline(index)}
                      className="mt-2"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                <div className="flex gap-2 items-start">
                  <Textarea 
                    value={newGuideline}
                    onChange={(e) => setNewGuideline(e.target.value)}
                    placeholder="Adicione uma nova diretriz..."
                    className="flex-1 min-h-[60px]"
                  />
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={addScriptGuideline}
                    className="mt-2"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground">
                <p>Estas diretrizes serão adicionadas ao script gerado para auxiliar na interpretação do fluxo de atendimento.</p>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>Salvar</Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default AssistantProfile;
