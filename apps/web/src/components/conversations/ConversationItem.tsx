/**
 * ConversationItem Component
 * Individual conversation card in the list
 */

import type { Conversation } from '@/types/api.types';
import { MessageSquare, Clock } from 'lucide-react';

export interface ConversationItemProps {
  conversation: Conversation;
  onClick: () => void;
  isActive?: boolean;
}

export function ConversationItem({ conversation, onClick, isActive = false }: ConversationItemProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Agora';
    if (diffMins < 60) return `${diffMins}m atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays < 7) return `${diffDays}d atrás`;
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-lg cursor-pointer transition-all border ${
        isActive
          ? 'bg-primary-50 border-primary-300 shadow-sm'
          : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-1 flex-1">
          {conversation.title}
        </h3>
        <span className="text-xs text-gray-500 ml-2 flex items-center whitespace-nowrap">
          <Clock className="w-3 h-3 mr-1" />
          {formatDate(conversation.updatedAt)}
        </span>
      </div>
      <div className="flex items-center text-xs text-gray-600">
        <MessageSquare className="w-3 h-3 mr-1" />
        <span>{conversation.messageCount} mensagens</span>
      </div>
    </div>
  );
}

export default ConversationItem;
