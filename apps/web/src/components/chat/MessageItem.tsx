/**
 * MessageItem Component
 * Individual message display (user or assistant)
 */

import type { Message } from '@/types/api.types';

export interface MessageItemProps {
  message: Message;
}

export function MessageItem({ message }: MessageItemProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} message-enter`}>
      <div
        className={`max-w-[70%] px-4 py-3 rounded-lg ${
          isUser
            ? 'bg-primary-600 text-white rounded-br-none'
            : 'bg-gray-100 text-gray-900 rounded-bl-none'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
        {message.metadata?.processingTime && !isUser && (
          <span className="text-xs opacity-70 mt-1 block">
            {(message.metadata.processingTime / 1000).toFixed(2)}s
          </span>
        )}
      </div>
    </div>
  );
}

export default MessageItem;
