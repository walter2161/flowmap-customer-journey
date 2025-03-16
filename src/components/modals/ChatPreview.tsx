import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SendHorizontal, Bot, User, Loader2 } from 'lucide-react';
import { AssistantProfile } from '@/utils/flowTypes';
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

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
  const { toast } = useToast();
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant' | 'system', content: string }>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [apiKey, setApiKey] = useState<string>('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');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  
  // Start with assistant welcome message and system message when modal opens
  useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens
      if (apiKey) {
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
        
        setMessages([
          systemMessage,
          { role: 'assistant', content: welcomeMessage }
        ]);
      } else {
        setMessages([]);
      }
      
      setInput('');
      setIsLoading(false);
    }
  }, [isOpen, scriptContent, profile, apiKey]);
  
  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (input.trim() === '') return;
    
    // Add user message to chat
    const userMessage = { role: 'user' as const, content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Get current messages to send to API
      const currentMessages = [...messages, userMessage].filter(msg => 
        msg.role === 'user' || msg.role === 'assistant' || msg.role === 'system'
      );
      
      // Call OpenAI API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: currentMessages,
          temperature: 0.7,
          max_tokens: 800
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Erro ao chamar a API');
      }
      
      const data = await response.json();
      const botResponse = data.choices[0].message.content;
      
      // Add assistant response to messages
      const assistantMessage = { role: 'assistant' as const, content: botResponse };
      setMessages(prev => [...prev, assistantMessage]);
      
      toast({
        title: "Resposta recebida",
        description: "A LLM respondeu à sua mensagem.",
        duration: 2000
      });
    } catch (error) {
      console.error('Error generating response:', error);
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, verifique sua chave de API e tente novamente.' 
      }]);
      
      toast({
        title: "Erro no processamento",
        description: error instanceof Error ? error.message : "Houve um problema ao conectar com a API da LLM.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmitApiKey = () => {
    if (apiKey.trim().length > 0) {
      setShowApiKeyInput(false);
      
      // Initialize chat with system and welcome message
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
      
      setMessages([
        systemMessage,
        { role: 'assistant', content: welcomeMessage }
      ]);
      
      toast({
        title: "API Configurada",
        description: "Conexão com a LLM estabelecida com sucesso.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col p-0 gap-0 bg-gray-50">
        <DialogHeader className="px-4 py-2 bg-white border-b">
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            {profile?.name || "Assistente"} - Chat LLM
          </DialogTitle>
        </DialogHeader>
        
        {showApiKeyInput ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-4">
            <div className="text-center space-y-2 max-w-md">
              <h3 className="text-lg font-medium">Configurar Conexão</h3>
              <p className="text-sm text-gray-500">
                Para utilizar o chat com uma LLM real, insira abaixo sua chave de API da OpenAI.
                A chave será usada apenas nesta sessão e não será armazenada.
              </p>
            </div>
            
            <div className="w-full max-w-md space-y-2">
              <Input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="w-full"
              />
              <Button 
                onClick={handleSubmitApiKey}
                className="w-full"
                disabled={apiKey.trim().length === 0}
              >
                Conectar
              </Button>
            </div>
            
            <p className="text-xs text-gray-400 text-center max-w-md">
              Sua chave de API é processada apenas no seu navegador e não é armazenada em nossos servidores.
              Você pode obter uma chave em <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline">OpenAI API Keys</a>.
            </p>
          </div>
        ) : (
          <>
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
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  className="w-full min-h-[80px] pr-12 resize-none rounded-xl border-gray-300 focus:border-primary focus:ring focus:ring-primary/20"
                  disabled={isLoading}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={handleSendMessage}
                  disabled={isLoading || input.trim() === ''}
                  className="absolute bottom-3 right-3 p-2 rounded-full bg-primary hover:bg-primary/90 transition-colors"
                  size="icon"
                >
                  <SendHorizontal className="h-5 w-5 text-white" />
                </Button>
              </div>
              <div className="mt-2 text-xs text-gray-500 italic text-center">
                Chat com OpenAI LLM em tempo real usando gpt-4o-mini. Pressione Enter para enviar.
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ChatPreview;
