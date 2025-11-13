/**
 * Messages API Service
 * All REST API endpoints for message management
 */

import apiClient from './client';
import type {
  Message,
  SendMessageDto,
  ConversationHistory,
  GetMessagesQuery,
} from '@/types/api.types';

/**
 * Messages API Service
 */
export const messagesApi = {
  /**
   * Send a new message to a conversation
   * POST /messages/:conversationId
   */
  async send(conversationId: string, dto: SendMessageDto): Promise<Message> {
    const response = await apiClient.post<Message>(`/messages/${conversationId}`, dto);
    return response.data;
  },

  /**
   * Get all messages in a conversation
   * GET /messages/:conversationId?limit=50&offset=0
   */
  async getByConversation(
    conversationId: string,
    query?: GetMessagesQuery,
  ): Promise<Message[]> {
    const response = await apiClient.get<Message[]>(`/messages/${conversationId}`, {
      params: query,
    });
    return response.data;
  },

  /**
   * Get a single message by ID
   * GET /messages/message/:messageId
   */
  async getById(messageId: string): Promise<Message> {
    const response = await apiClient.get<Message>(`/messages/message/${messageId}`);
    return response.data;
  },

  /**
   * Get the last message in a conversation
   * GET /messages/:conversationId/last
   */
  async getLastMessage(conversationId: string): Promise<Message | null> {
    try {
      const response = await apiClient.get<Message>(`/messages/${conversationId}/last`);
      return response.data;
    } catch (error) {
      // Return null if no messages exist (404)
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 404) {
          return null;
        }
      }
      throw error;
    }
  },

  /**
   * Get conversation history formatted for AI
   * GET /messages/:conversationId/history?limit=50
   */
  async getHistory(conversationId: string, limit?: number): Promise<ConversationHistory[]> {
    const response = await apiClient.get<ConversationHistory[]>(
      `/messages/${conversationId}/history`,
      {
        params: { limit },
      },
    );
    return response.data;
  },

  /**
   * Delete a message
   * DELETE /messages/:messageId
   */
  async delete(messageId: string): Promise<void> {
    await apiClient.delete(`/messages/${messageId}`);
  },
};

// Named exports for individual methods (optional)
export const {
  send: sendMessage,
  getByConversation: getMessagesByConversation,
  getById: getMessageById,
  getLastMessage,
  getHistory: getConversationHistory,
  delete: deleteMessage,
} = messagesApi;

export default messagesApi;
