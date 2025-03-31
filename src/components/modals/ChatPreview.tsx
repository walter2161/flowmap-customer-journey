
import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SendHorizontal, Bot, User, Loader2, FolderTree, Share2 } from 'lucide-react';
import { AssistantProfile } from '@/utils/flowTypes';
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import ShareChatModal from './ShareChatModal';

// Mistral API key
const MISTRAL_API_KEY = "uVf0xInU0S6AbjC9WwCAWtnjRBReinIy";

interface ChatPreviewProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  scriptContent: string;
  profile?: AssistantProfile | null;
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
}

const ChatPreview: React.FC<ChatPreviewProps> = ({
  isOpen,
  onOpenChange,
  scriptContent,
  profile
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isContextExpanded, setIsContextExpanded] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [initialized, setInitialized] = useState(false);
  
  // Initialize chat with system and welcome messages when modal opens
  useEffect(() => {
    if (isOpen && !initialized) {
      // Create system message with instructions for the assistant
      const systemMessage: ChatMessage = {
        role: 'system',
        content: `Instruções para o assistente virtual:

1. Você é um assistente de atendimento que deve utilizar as informações do roteiro abaixo para guiar suas interações:
${scriptContent}

2. IMPORTANTE: 
   - Não mencione que está usando um "roteiro", "script" ou "fluxo de atendimento".
   - Atue como se este conhecimento fosse natural para você.
   - Nunca mencione os "cartões", "cards" ou a existência de um fluxograma.
   - Nunca repita trechos do roteiro diretamente, reformule com suas próprias palavras.
   - Suas respostas devem ser MUITO CURTAS e DIRETAS (máximo 1-2 frases).
   - NÃO inclua comentários entre parênteses como "(Se o cliente precisar...)" nas suas respostas.
   - NÃO ENUMERE opções diferentes nas suas respostas.

3. Use o conteúdo dos cartões, seus títulos, descrições e as conexões entre eles como guia para sua conversa.

4. Quando o usuário expressar uma intenção específica, identifique qual conexão do fluxo deve seguir e direcione a conversa conforme o conteúdo do próximo cartão.

5. Seja conversacional e natural:
   - Use uma linguagem simples e direta.
   - Evite respostas longas ou explicativas demais.
   - Faça apenas uma pergunta por vez para guiar o usuário.

6. Se uma pergunta estiver fora do escopo, diga apenas: "Não tenho essa informação. Posso ajudar com [mencione tópico principal do roteiro]?"

7. IMPORTANTE: Mantenha suas respostas extremamente concisas (máximo 1-2 frases).

8. Nunca invente informações além do que está no roteiro.`,
        timestamp: new Date()
      };
      
      // Create welcome message based on profile
      let welcomeMessage = '';
      
      if (profile) {
        welcomeMessage = `Olá! Sou ${profile.name}. Como posso ajudar?`;
      } else {
        welcomeMessage = 'Olá! Como posso ajudar?';
      }
      
      const assistantWelcome: ChatMessage = {
        role: 'assistant',
        content: welcomeMessage,
        timestamp: new Date()
      };
      
      // Set initial messages
      setMessages([systemMessage, assistantWelcome]);
      setInitialized(true);
    }
    
    // Reset initialized state when modal closes
    if (!isOpen) {
      setInitialized(false);
    }
  }, [isOpen, scriptContent, profile, initialized]);
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Auto resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);
  
  // Handle sending message to Mistral AI API
  const handleSendMessage = async () => {
    if (input.trim() === '') return;
    
    // Add user message to chat
    const userMessage: ChatMessage = { 
      role: 'user', 
      content: input.trim(),
      timestamp: new Date()
    };
    
    // Update messages state with user message
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Prepare messages for Mistral API (exclude timestamps)
      const messagesForApi = messages
        .concat(userMessage)
        .map(({ role, content }) => ({ role, content }));
      
      // Call Mistral API
      const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${MISTRAL_API_KEY}`
        },
        body: JSON.stringify({
          model: 'mistral-tiny',
          messages: messagesForApi,
          temperature: 0.5, // Lower temperature for more concise responses
          max_tokens: 100  // Limit token generation for shorter responses
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Erro ao conectar com a Mistral AI');
      }
      
      const data = await response.json();
      console.log('Mistral API response:', data);
      
      // Get assistant response and remove any parenthetical instructions
      let assistantResponse = data.choices[0]?.message?.content || 'Desculpe, não consegui processar sua solicitação.';
      
      // Process response to remove parenthetical instructions and ensure brevity
      assistantResponse = assistantResponse
        .replace(/\([^)]*\)/g, '') // Remove parenthetical comments
        .replace(/^\s+|\s+$/g, '') // Trim whitespace
        .split('\n\n')[0]; // Take only the first paragraph
      
      // Add assistant response to messages
      const assistantMessage: ChatMessage = { 
        role: 'assistant', 
        content: assistantResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Erro ao processar resposta:', error);
      toast({
        title: "Erro na API",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao conectar com a Mistral AI",
        variant: "destructive"
      });
      
      // Add error message to chat
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente mais tarde.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col p-0 gap-0 bg-gray-50">
          <DialogHeader className="px-4 py-2 bg-white border-b">
            <DialogTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              {profile?.name || "Assistente"} - Mistral AI
            </DialogTitle>
            <DialogDescription className="sr-only">
              Converse com o assistente virtual baseado no roteiro de atendimento
            </DialogDescription>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={() => setIsContextExpanded(!isContextExpanded)}
              >
                <FolderTree className="h-4 w-4" />
                {isContextExpanded ? "Ocultar Contexto" : "Ver Contexto"}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={() => setIsShareModalOpen(true)}
              >
                <Share2 className="h-4 w-4" />
                Compartilhar
              </Button>
            </div>
          </DialogHeader>
          
          {isContextExpanded && (
            <div className="max-h-[200px] overflow-y-auto p-3 bg-gray-100 border-b text-xs">
              <h4 className="font-semibold mb-1">Contexto do Script:</h4>
              <pre className="whitespace-pre-wrap">{scriptContent}</pre>
            </div>
          )}
          
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.filter(msg => msg.role !== 'system').map((message, index) => (
                <div 
                  key={index} 
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-white border border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1 text-xs opacity-70">
                      {message.role === 'user' ? (
                        <>
                          <User className="h-3 w-3" /> Você
                        </>
                      ) : (
                        <>
                          <Bot className="h-3 w-3" /> {profile?.name || "Assistente"}
                        </>
                      )}
                      {message.timestamp && (
                        <span className="ml-auto">
                          {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      )}
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] p-3 rounded-lg bg-white border border-gray-200">
                    <div className="flex items-center gap-2 mb-1 text-xs opacity-70">
                      <Bot className="h-3 w-3" /> {profile?.name || "Assistente"}
                    </div>
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <p className="text-sm">Processando resposta...</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          <div className="p-4 border-t bg-white">
            <div className="relative">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Digite sua mensagem..."
                className="pr-12 resize-none min-h-[60px] max-h-[180px] overflow-y-auto"
                rows={1}
              />
              <Button 
                onClick={handleSendMessage} 
                variant="ghost" 
                size="icon"
                className="absolute right-2 bottom-2"
                disabled={isLoading || input.trim() === ''}
              >
                <SendHorizontal className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Share Chat Modal */}
      <ShareChatModal
        isOpen={isShareModalOpen}
        onOpenChange={setIsShareModalOpen}
        scriptContent={scriptContent}
        currentProfile={profile}
      />
    </>
  );
};

export default ChatPreview;
