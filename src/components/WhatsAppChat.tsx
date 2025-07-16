import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { Send, Phone, MessageCircle, Bot } from 'lucide-react';
import { whatsappService, WhatsAppChat as WhatsAppChatType, WhatsAppMessage } from '../services/whatsappService';
import { useFlowData } from '../hooks/useFlowData';

interface WhatsAppChatProps {
  selectedChat?: WhatsAppChatType;
  onChatSelect: (chat: WhatsAppChatType) => void;
}

export const WhatsAppChat: React.FC<WhatsAppChatProps> = ({ selectedChat, onChatSelect }) => {
  const [chats, setChats] = useState<WhatsAppChatType[]>([]);
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [connectionState, setConnectionState] = useState<string>('close');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Use empty initial data for the hook
  const flowDataHook = useFlowData({ cards: [], connections: [] });
  const nodes = flowDataHook?.nodes || [];

  useEffect(() => {
    // Setup WhatsApp service listeners
    whatsappService.onConnectionStateChange((state) => setConnectionState(state as string));
    whatsappService.onChatsUpdated(setChats);
    whatsappService.onMessageReceived((message) => {
      if (selectedChat && (message.from === selectedChat.jid || message.to === selectedChat.jid)) {
        setMessages(prev => [...prev, message]);
        processMessageWithFlow(message);
      }
    });

    // Initialize connection
    whatsappService.connect();

    return () => {
      whatsappService.disconnect();
    };
  }, [selectedChat]);

  useEffect(() => {
    if (selectedChat) {
      setMessages(whatsappService.getChatMessages(selectedChat.jid));
    }
  }, [selectedChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const processMessageWithFlow = async (message: WhatsAppMessage) => {
    if (message.isFromMe || isProcessing) return;

    setIsProcessing(true);
    try {
      // Find start node (welcome/greeting type)
      const startNode = nodes.find(node =>
        node.data.cardType === 'greeting' || 
        node.data.cardType === 'welcome' ||
        node.data.title?.toLowerCase().includes('início') ||
        node.data.title?.toLowerCase().includes('bem-vindo')
      );

      if (!startNode) {
        console.log('Nenhum nó de início encontrado no fluxo');
        return;
      }

      // Simulate AI agent processing
      const response = await simulateAIAgent(message.body, startNode, nodes);
      
      if (response) {
        await whatsappService.sendMessage(message.from, response);
      }
    } catch (error) {
      console.error('Erro ao processar mensagem com fluxo:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const simulateAIAgent = async (userMessage: string, startNode: any, nodes: any[]): Promise<string> => {
    // Simple flow simulation based on keywords and node types
    const lowerMessage = userMessage.toLowerCase();
    
    // Check for greeting
    if (lowerMessage.includes('oi') || lowerMessage.includes('olá') || lowerMessage.includes('bom dia')) {
      return startNode.data.description || startNode.data.title || 'Olá! Como posso ajudá-lo?';
    }

    // Find relevant nodes based on keywords
    const relevantNode = nodes.find(node => {
      const title = node.data.title?.toLowerCase() || '';
      const description = node.data.description?.toLowerCase() || '';
      
      return title.includes(lowerMessage) || 
             description.includes(lowerMessage) ||
             lowerMessage.includes(title) ||
             lowerMessage.includes(description);
    });

    if (relevantNode) {
      return relevantNode.data.description || relevantNode.data.title || 'Entendi! Deixe-me ajudá-lo com isso.';
    }

    // Default response
    return 'Desculpe, não entendi sua mensagem. Pode reformular?';
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || connectionState !== 'open') return;

    try {
      await whatsappService.sendMessage(selectedChat.jid, newMessage);
      setNewMessage('');
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPhoneNumber = (jid: string) => {
    const number = jid.replace('@s.whatsapp.net', '');
    return `+${number.slice(0, 2)} (${number.slice(2, 4)}) ${number.slice(4, 9)}-${number.slice(9)}`;
  };

  return (
    <div className="flex h-full gap-4">
      {/* Chats List */}
      <Card className="w-1/3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            WhatsApp Chats
            <Badge variant={connectionState === 'open' ? 'default' : 'destructive'}>
              {connectionState === 'open' ? 'Conectado' : 'Desconectado'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            {chats.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <Phone className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma conversa encontrada</p>
                <p className="text-sm">Conecte-se ao WhatsApp para começar</p>
              </div>
            ) : (
              <div className="space-y-2">
                {chats.map((chat) => (
                  <div
                    key={chat.jid}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedChat?.jid === chat.jid 
                        ? 'bg-primary/10 border border-primary/20' 
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => onChatSelect(chat)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{formatPhoneNumber(chat.jid)}</h4>
                        {chat.lastMessage && (
                          <p className="text-xs text-muted-foreground truncate">
                            {chat.lastMessage.body}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {chat.lastMessage && (
                          <span className="text-xs text-muted-foreground">
                            {formatTime(chat.lastMessage.timestamp)}
                          </span>
                        )}
                        {chat.unreadCount > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {chat.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat Messages */}
      <Card className="flex-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {selectedChat ? (
              <>
                <MessageCircle className="h-5 w-5" />
                {formatPhoneNumber(selectedChat.jid)}
                {isProcessing && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Bot className="h-3 w-3" />
                    Processando...
                  </Badge>
                )}
              </>
            ) : (
              'Selecione uma conversa'
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col h-[500px]">
          {selectedChat ? (
            <>
              <ScrollArea className="flex-1 mb-4">
                <div className="space-y-2">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isFromMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-lg ${
                          message.isFromMe
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm">{message.body}</p>
                        <span className="text-xs opacity-70">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              
              <div className="flex gap-2">
                <Input
                  placeholder="Digite sua mensagem..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  disabled={connectionState !== 'open'}
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || connectionState !== 'open'}
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Selecione uma conversa para começar</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};