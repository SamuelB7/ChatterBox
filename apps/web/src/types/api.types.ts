/**
 * API Types for ChatterBox 2.0
 * TypeScript interfaces for API requests and responses
 */

// ============================================================================
// Conversation Types
// ============================================================================

export interface Conversation {
  id: string;
  title: string;
  status: 'active' | 'archived';
  messageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateConversationDto {
  title?: string;
}

export interface UpdateConversationTitleDto {
  title: string;
}

export interface ConversationStats {
  totalActive: number;
  totalArchived: number;
}

// ============================================================================
// Message Types
// ============================================================================

export interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  metadata?: {
    model?: string;
    processingTime?: number;
    [key: string]: unknown;
  };
  createdAt: string;
}

export interface SendMessageDto {
  content: string;
}

export interface ConversationHistory {
  role: 'user' | 'assistant';
  content: string;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedConversationsResponse {
  conversations: Conversation[];
  pagination: PaginationInfo;
}

export interface PaginatedMessagesResponse {
  messages: Message[];
  pagination: PaginationInfo;
}

// ============================================================================
// Query Parameters
// ============================================================================

export interface GetConversationsQuery {
  status?: 'active' | 'archived';
  limit?: number;
  page?: number;
}

export interface GetMessagesQuery {
  limit?: number;
  offset?: number;
}
