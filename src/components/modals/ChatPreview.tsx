
import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SendHorizontal, Bot, User, Loader2, FolderTree } from 'lucide-react';
import { AssistantProfile } from '@/utils/flowTypes';
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

// Mistral API key
const MISTRAL_API_KEY = "uVf0xInU0S6AbjC9WwCAWtnjRBReinIy";

interface ChatPreviewProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  scriptContent: string;
  profile?: AssistantProfile | null;
}

const ChatPreview: React.FC<ChatPreviewProps> = ({
  isOpen,
  onOpenChange,
  scriptContent,
  profile
}) => {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant' | 'system', content: string }>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isContextExpanded, setIsContextExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Start with assistant welcome message and system message when modal opens
  useEffect(() => {
    if (isOpen) {
      // Create system message based on script content
      const systemMessage = {
        role: 'system' as const,
        content: `Instruções para o assistente virtual:
        
1. Você é um assistente com conhecimento baseado no seguinte roteiro:
${scriptContent}

2. Use as informações acima para responder perguntas dos usuários.
3. Se uma pergunta estiver fora do escopo do roteiro, informe gentilmente que não pode ajudar com isso.
4. Mantenha um tom conversacional e amigável.
5. Seja conciso nas respostas.
6. Use análise de linguagem natural (NLP) para interpretar a intenção do usuário e encontrar informações relevantes no roteiro.
7. Mantenha contexto da conversa para proporcionar respostas coerentes ao longo da interação.`
      };
      
      // Create welcome message based on profile if available
      let welcomeMessage = '';
      
      if (profile) {
        welcomeMessage = `Olá! Eu sou ${profile.name} ${profile.profession ? `da ${profile.profession}` : ''} ${profile.company ? `na ${profile.company}` : ''}. Como posso ajudar você hoje?`;
      } else {
        welcomeMessage = 'Olá! Como posso ajudar você hoje?';
      }
      
      // Set initial messages
      setMessages([
        systemMessage,
        { role: 'assistant', content: welcomeMessage }
      ]);
    }
  }, [isOpen, scriptContent, profile]);
  
  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
    const userMessage = { role: 'user' as const, content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Prepare messages for Mistral API
      const messagesForApi = messages.concat(userMessage);
      
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
          temperature: 0.7,
          max_tokens: 800
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Erro ao conectar com a Mistral AI');
      }
      
      const data = await response.json();
      const assistantResponse = data.choices[0]?.message?.content || 'Desculpe, não consegui processar sua solicitação.';
      
      // Add assistant response to messages
      const assistantMessage = { 
        role: 'assistant' as const, 
        content: assistantResponse
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
        content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente mais tarde.' 
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
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col p-0 gap-0 bg-gray-50">
        <DialogHeader className="px-4 py-2 bg-white border-b">
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            {profile?.name || "Assistente"} - Mistral AI
          </DialogTitle>
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
          </div>
        </DialogHeader>
        
        {isContextExpanded && (
          <div className="max-h-[200px] overflow-y-auto p-3 bg-gray-100 border-b text-xs">
            <h4 className="font-semibold mb-1">Contexto do Script:</h4>
            <pre className="whitespace-pre-wrap">{scriptContent}</pre>
          </div>
        )}
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
  );
};

export default ChatPreview;
