/**
 * ConversationPage Component
 * Page displaying a single conversation with chat
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Sidebar } from '@/components/layout/Sidebar';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { Spinner } from '@/components/ui/Spinner';
import { conversationsApi, messagesApi } from '@/services/api';
import { socketService, ChatSocket } from '@/services/websocket';
import type { Conversation, Message } from '@/types/api.types';

export function ConversationPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const chatSocketRef = useRef<ChatSocket | null>(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (id) {
      loadConversation(id);
      loadMessages(id);
      setupWebSocket(id);
    }

    return () => {
      if (chatSocketRef.current && id) {
        chatSocketRef.current.leaveConversation(id);
        chatSocketRef.current.removeAllListeners();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadConversations = async () => {
    try {
      const data = await conversationsApi.getAll({ status: 'active' });
      setConversations(data.conversations);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const loadConversation = async (conversationId: string) => {
    try {
      await conversationsApi.getById(conversationId);
    } catch (error) {
      console.error('Error loading conversation:', error);
      navigate('/');
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      setIsLoading(true);
      const data = await messagesApi.getByConversation(conversationId);
      setMessages(data.messages);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setupWebSocket = (conversationId: string) => {
    const socket = socketService.connect();
    const chatSocket = new ChatSocket(socket);
    chatSocketRef.current = chatSocket;

    chatSocket.joinConversation(conversationId);

    chatSocket.onJoinedConversation((payload) => {
      console.log('Joined conversation:', payload);
    });

    chatSocket.onAITyping((payload) => {
      setIsTyping(payload.isTyping);
    });

    chatSocket.onAIResponseStream(() => {
      // Stream chunks are handled in real-time by the backend
      // Messages will be completed via onAIResponseComplete
    });

    chatSocket.onAIResponseComplete((payload) => {
      setIsTyping(false);
      setMessages((prev) => [...prev, payload.message]);
      loadConversations(); // Refresh conversation list
    });

    chatSocket.onError((payload) => {
      console.error('WebSocket error:', payload);
      setIsTyping(false);
    });
  };

  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!id || !chatSocketRef.current) return;

      try {
        // Add user message to UI immediately
        const tempUserMessage: Message = {
          id: `temp-${Date.now()}`,
          conversationId: id,
          role: 'user',
          content,
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, tempUserMessage]);

        // Send via WebSocket
        chatSocketRef.current.sendMessage(id, content);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    },
    [id],
  );

  const handleNewConversation = async () => {
    try {
      setIsCreating(true);
      const newConversation = await conversationsApi.create({ title: 'Nova Conversa' });
      setConversations([newConversation, ...conversations]);
      navigate(`/conversation/${newConversation.id}`);
    } catch (error) {
      console.error('Error creating conversation:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleSelectConversation = (conversationId: string) => {
    navigate(`/conversation/${conversationId}`);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex h-full items-center justify-center">
          <Spinner size="lg" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex h-full">
        <Sidebar
          conversations={conversations}
          activeConversationId={id}
          onSelectConversation={handleSelectConversation}
          onNewConversation={handleNewConversation}
          isCreating={isCreating}
        />
        <div className="flex-1 p-6 bg-gray-100">
          <div className="h-full max-w-4xl mx-auto">
            <ChatWindow
              messages={messages}
              onSendMessage={handleSendMessage}
              isTyping={isTyping}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ConversationPage;
