/**
 * Sidebar Component
 * Sidebar with conversation list
 */

import type { Conversation } from '@/types/api.types';
import { ConversationList } from '../conversations/ConversationList';
import { NewConversationButton } from '../conversations/NewConversationButton';

export interface SidebarProps {
  conversations: Conversation[];
  activeConversationId?: string;
  onSelectConversation: (conversationId: string) => void;
  onNewConversation: () => void;
  isLoading?: boolean;
  isCreating?: boolean;
}

export function Sidebar({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  isLoading = false,
  isCreating = false,
}: SidebarProps) {
  return (
    <aside className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <NewConversationButton onClick={onNewConversation} isLoading={isCreating} />
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
        <ConversationList
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={onSelectConversation}
          isLoading={isLoading}
        />
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          {conversations.length} {conversations.length === 1 ? 'conversa' : 'conversas'}
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;
