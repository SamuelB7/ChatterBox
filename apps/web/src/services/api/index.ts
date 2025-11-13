/**
 * API Services Index
 * Central export point for all API services
 */

export { default as apiClient, getErrorMessage, isErrorStatus } from './client';
export { conversationsApi, default as conversationsApiDefault } from './conversations.api';
export { messagesApi, default as messagesApiDefault } from './messages.api';

// Re-export all named methods for convenience
export {
  createConversation,
  getAllConversations,
  getConversationById,
  updateConversationTitle,
  archiveConversation,
  unarchiveConversation,
  deleteConversation,
  getConversationStats,
} from './conversations.api';

export {
  sendMessage,
  getMessagesByConversation,
  getMessageById,
  getLastMessage,
  getConversationHistory,
  deleteMessage,
} from './messages.api';

// Export types
export type * from '@/types/api.types';
