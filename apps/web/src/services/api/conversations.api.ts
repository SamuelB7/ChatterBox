/**
 * Conversations API Service
 * All REST API endpoints for conversation management
 */

import apiClient from './client';
import type {
  Conversation,
  CreateConversationDto,
  UpdateConversationTitleDto,
  ConversationStats,
  GetConversationsQuery,
} from '@/types/api.types';

/**
 * Conversations API Service
 */
export const conversationsApi = {
  /**
   * Create a new conversation
   * POST /conversations
   */
  async create(dto?: CreateConversationDto): Promise<Conversation> {
    const response = await apiClient.post<Conversation>('/conversations', dto || {});
    return response.data;
  },

  /**
   * Get all conversations with optional filters
   * GET /conversations?status=active&limit=50
   */
  async getAll(query?: GetConversationsQuery): Promise<Conversation[]> {
    const response = await apiClient.get<Conversation[]>('/conversations', {
      params: query,
    });
    return response.data;
  },

  /**
   * Get a single conversation by ID
   * GET /conversations/:id
   */
  async getById(id: string): Promise<Conversation> {
    const response = await apiClient.get<Conversation>(`/conversations/${id}`);
    return response.data;
  },

  /**
   * Update conversation title
   * PATCH /conversations/:id/title
   */
  async updateTitle(id: string, dto: UpdateConversationTitleDto): Promise<Conversation> {
    const response = await apiClient.patch<Conversation>(`/conversations/${id}/title`, dto);
    return response.data;
  },

  /**
   * Archive a conversation
   * PATCH /conversations/:id/archive
   */
  async archive(id: string): Promise<Conversation> {
    const response = await apiClient.patch<Conversation>(`/conversations/${id}/archive`);
    return response.data;
  },

  /**
   * Unarchive a conversation
   * PATCH /conversations/:id/unarchive
   */
  async unarchive(id: string): Promise<Conversation> {
    const response = await apiClient.patch<Conversation>(`/conversations/${id}/unarchive`);
    return response.data;
  },

  /**
   * Delete a conversation
   * DELETE /conversations/:id
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/conversations/${id}`);
  },

  /**
   * Get conversation statistics
   * GET /conversations/stats
   */
  async getStats(): Promise<ConversationStats> {
    const response = await apiClient.get<ConversationStats>('/conversations/stats');
    return response.data;
  },
};

// Named exports for individual methods (optional)
export const {
  create: createConversation,
  getAll: getAllConversations,
  getById: getConversationById,
  updateTitle: updateConversationTitle,
  archive: archiveConversation,
  unarchive: unarchiveConversation,
  delete: deleteConversation,
  getStats: getConversationStats,
} = conversationsApi;

export default conversationsApi;
