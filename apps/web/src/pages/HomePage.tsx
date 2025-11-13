/**
 * HomePage Component
 * Main page with conversation list and selected conversation
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Sidebar } from '@/components/layout/Sidebar';
import { EmptyState } from '@/components/ui/EmptyState';
import { conversationsApi } from '@/services/api';
import type { Conversation } from '@/types/api.types';
import { MessageSquare } from 'lucide-react';

export function HomePage() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setIsLoading(true);
      const data = await conversationsApi.getAll({ status: 'active' });
      setConversations(data);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <Layout>
      <div className="flex h-full">
        <Sidebar
          conversations={conversations}
          onSelectConversation={handleSelectConversation}
          onNewConversation={handleNewConversation}
          isLoading={isLoading}
          isCreating={isCreating}
        />
        <div className="flex-1 flex items-center justify-center bg-gray-100">
          <EmptyState
            icon={<MessageSquare className="w-20 h-20" />}
            title="Selecione uma conversa"
            description="Escolha uma conversa da lista ou crie uma nova para começar."
          />
        </div>
      </div>
    </Layout>
  );
}

export default HomePage;
