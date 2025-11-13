/**
 * ConversationList Component
 * List of all conversations
 */

import type { Conversation } from '@/types/api.types';
import { ConversationItem } from './ConversationItem';
import { EmptyState } from '../ui/EmptyState';
import { Spinner } from '../ui/Spinner';
import { MessageSquare } from 'lucide-react';

export interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId?: string;
  onSelectConversation: (conversationId: string) => void;
  isLoading?: boolean;
}

export function ConversationList({
  conversations,
  activeConversationId,
  onSelectConversation,
  isLoading = false,
}: ConversationListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner size="md" />
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <EmptyState
        icon={<MessageSquare className="w-12 h-12" />}
        title="Nenhuma conversa"
        description="Clique em 'Nova Conversa' para começar."
      />
    );
  }

  return (
    <div className="space-y-2">
      {conversations.map((conversation) => (
        <ConversationItem
          key={conversation.id}
          conversation={conversation}
          onClick={() => onSelectConversation(conversation.id)}
          isActive={conversation.id === activeConversationId}
        />
      ))}
    </div>
  );
}

export default ConversationList;
