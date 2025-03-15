
import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SendHorizontal, Bot, User, Loader2 } from 'lucide-react';
import { AssistantProfile } from '@/utils/flowTypes';

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
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Start with assistant welcome message when modal opens
  useEffect(() => {
    if (isOpen) {
      // Create welcome message based on profile if available
      let welcomeMessage = '';
      
      if (profile) {
        welcomeMessage = `Olá! Eu sou ${profile.name} ${profile.profession ? `da ${profile.profession}` : ''} ${profile.company ? `na ${profile.company}` : ''}. Como posso ajudar você hoje?`;
      } else {
        welcomeMessage = 'Olá! Como posso ajudar você hoje?';
      }
      
      setMessages([
        { role: 'assistant', content: welcomeMessage }
      ]);
    }
  }, [isOpen, profile]);
  
  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (input.trim() === '') return;
    
    // Add user message to chat
    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsLoading(true);
    
    try {
      // This is a simulation of using AutoGPT to process the script
      // In a real implementation, this would connect to the AutoGPT API
      // For now, we'll just simulate a response after a short delay
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create a simulated response based on the user's message and script content
      let botResponse = "Estou analisando sua mensagem com base no roteiro configurado...";
      
      // Very simple pattern matching to simulate responses
      if (userMessage.toLowerCase().includes('olá') || 
          userMessage.toLowerCase().includes('oi') || 
          userMessage.toLowerCase().includes('bom dia') || 
          userMessage.toLowerCase().includes('boa tarde') || 
          userMessage.toLowerCase().includes('boa noite')) {
        botResponse = "Olá! Em que posso ajudar você hoje?";
      } else if (userMessage.toLowerCase().includes('preço') || 
                userMessage.toLowerCase().includes('valor') || 
                userMessage.toLowerCase().includes('custo')) {
        botResponse = "Sobre preços, temos diferentes opções que podem se adequar ao seu orçamento. Posso te enviar nossa tabela de preços atualizada ou podemos discutir suas necessidades específicas para encontrar a melhor opção.";
      } else if (userMessage.toLowerCase().includes('horário') || 
                userMessage.toLowerCase().includes('agendar') || 
                userMessage.toLowerCase().includes('marcar')) {
        botResponse = "Para agendar um horário, preciso verificar nossa disponibilidade. Qual seria a melhor data e horário para você?";
      } else if (userMessage.toLowerCase().includes('dúvida') || 
                userMessage.toLowerCase().includes('pergunta')) {
        botResponse = "Estou aqui para responder suas dúvidas! Por favor, me diga mais detalhes sobre o que você gostaria de saber.";
      } else if (userMessage.toLowerCase().includes('obrigado') || 
                userMessage.toLowerCase().includes('obrigada')) {
        botResponse = "Foi um prazer ajudar! Se precisar de mais alguma coisa, estou à disposição.";
      } else {
        botResponse = "Entendi sua mensagem. Deixe-me verificar as informações no nosso roteiro de atendimento para te responder da melhor forma possível.";
      }
      
      // Add bot response to chat
      setMessages(prev => [...prev, { role: 'assistant', content: botResponse }]);
    } catch (error) {
      console.error('Error generating response:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
            {profile?.name || "Assistente"} - Preview Chat
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
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
                  <p className="text-sm">Digitando...</p>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-4 border-t bg-white">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua mensagem..."
              className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <Button onClick={handleSendMessage} variant="default" size="icon">
              <SendHorizontal className="h-5 w-5" />
            </Button>
          </div>
          <div className="mt-2 text-xs text-gray-500 italic text-center">
            Este é um preview simplificado. Uma integração completa com AutoGPT requer configuração adicional.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatPreview;
