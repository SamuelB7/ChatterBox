/**
 * MessageList Component
 * Scrollable list of messages
 */

import { useEffect, useRef } from 'react';
import type { Message } from '@/types/api.types';
import { MessageItem } from './MessageItem';

export interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}

export default MessageList;
