/**
 * ChatWindow Component
 * Main chat container with messages and input
 */

import type { Message } from '@/types/api.types';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { TypingIndicator } from './TypingIndicator';
import { EmptyState } from '../ui/EmptyState';
import { MessageSquare } from 'lucide-react';

export interface ChatWindowProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isTyping?: boolean;
  disabled?: boolean;
}

export function ChatWindow({
  messages,
  onSendMessage,
  isTyping = false,
  disabled = false,
}: ChatWindowProps) {
  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow">
      {/* Messages Area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <EmptyState
              icon={<MessageSquare className="w-16 h-16" />}
              title="Nenhuma mensagem ainda"
              description="Envie uma mensagem para começar a conversa com a IA sobre a Terra Plana."
            />
          </div>
        ) : (
          <>
            <MessageList messages={messages} />
            {isTyping && (
              <div className="px-4 pb-4">
                <TypingIndicator />
              </div>
            )}
          </>
        )}
      </div>

      {/* Input Area */}
      <MessageInput onSend={onSendMessage} disabled={disabled} />
    </div>
  );
}

export default ChatWindow;
