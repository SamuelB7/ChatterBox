/**
 * WebSocket Types for ChatterBox 2.0
 * TypeScript interfaces for Socket.io events and payloads
 */

import type { Message } from './api.types';

// ============================================================================
// WebSocket Events
// ============================================================================

export const WebSocketEvent = {
  // Client → Server
  JOIN_CONVERSATION: 'join:conversation',
  LEAVE_CONVERSATION: 'leave:conversation',
  SEND_MESSAGE: 'send:message',

  // Server → Client
  JOINED_CONVERSATION: 'joined:conversation',
  AI_TYPING: 'ai:typing',
  AI_RESPONSE_STREAM: 'ai:response:stream',
  AI_RESPONSE_COMPLETE: 'ai:response:complete',
  ERROR: 'error',
} as const;

export type WebSocketEvent = (typeof WebSocketEvent)[keyof typeof WebSocketEvent];

// ============================================================================
// Event Payloads - Client → Server
// ============================================================================

export interface JoinConversationPayload {
  conversationId: string;
}

export interface LeaveConversationPayload {
  conversationId: string;
}

export interface SendMessagePayload {
  conversationId: string;
  message: string;
}

// ============================================================================
// Event Payloads - Server → Client
// ============================================================================

export interface JoinedConversationPayload {
  conversationId: string;
  message: string;
}

export interface AITypingPayload {
  conversationId: string;
  isTyping: boolean;
}

export interface AIResponseStreamPayload {
  conversationId: string;
  chunk: string;
}

export interface AIResponseCompletePayload {
  conversationId: string;
  userMessageId: string;
  assistantMessageId: string;
  message: Message;
}

export interface ErrorPayload {
  message: string;
  code?: string;
}

// ============================================================================
// WebSocket Connection Status
// ============================================================================

export const ConnectionStatus = {
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  CONNECTING: 'connecting',
  RECONNECTING: 'reconnecting',
  ERROR: 'error',
} as const;

export type ConnectionStatus = (typeof ConnectionStatus)[keyof typeof ConnectionStatus];

// ============================================================================
// Callback Types
// ============================================================================

export type AITypingCallback = (payload: AITypingPayload) => void;
export type AIResponseStreamCallback = (payload: AIResponseStreamPayload) => void;
export type AIResponseCompleteCallback = (payload: AIResponseCompletePayload) => void;
export type ErrorCallback = (payload: ErrorPayload) => void;
export type ConnectionStatusCallback = (status: ConnectionStatus) => void;
