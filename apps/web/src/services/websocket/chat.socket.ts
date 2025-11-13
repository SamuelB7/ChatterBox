/**
 * Chat Socket Service
 * Handles chat-specific WebSocket events
 */

import type { Socket } from 'socket.io-client';
import {
  WebSocketEvent,
  type JoinConversationPayload,
  type LeaveConversationPayload,
  type SendMessagePayload,
  type JoinedConversationPayload,
  type AITypingCallback,
  type AIResponseStreamCallback,
  type AIResponseCompleteCallback,
  type ErrorCallback,
} from '@/types/websocket.types';

export class ChatSocket {
  private socket: Socket;

  constructor(socket: Socket) {
    this.socket = socket;
  }

  // ============================================================================
  // Emit Events (Client → Server)
  // ============================================================================

  /**
   * Join a conversation room
   */
  joinConversation(conversationId: string): void {
    const payload: JoinConversationPayload = { conversationId };
    this.socket.emit(WebSocketEvent.JOIN_CONVERSATION, payload);
    console.log('[ChatSocket] Joining conversation:', conversationId);
  }

  /**
   * Leave a conversation room
   */
  leaveConversation(conversationId: string): void {
    const payload: LeaveConversationPayload = { conversationId };
    this.socket.emit(WebSocketEvent.LEAVE_CONVERSATION, payload);
    console.log('[ChatSocket] Leaving conversation:', conversationId);
  }

  /**
   * Send a message to the conversation
   */
  sendMessage(conversationId: string, message: string): void {
    const payload: SendMessagePayload = { conversationId, message };
    this.socket.emit(WebSocketEvent.SEND_MESSAGE, payload);
    console.log('[ChatSocket] Sending message:', { conversationId, message });
  }

  // ============================================================================
  // Listen to Events (Server → Client)
  // ============================================================================

  /**
   * Listen for joined conversation confirmation
   */
  onJoinedConversation(callback: (payload: JoinedConversationPayload) => void): void {
    this.socket.on(WebSocketEvent.JOINED_CONVERSATION, callback);
  }

  /**
   * Listen for AI typing status
   */
  onAITyping(callback: AITypingCallback): void {
    this.socket.on(WebSocketEvent.AI_TYPING, callback);
  }

  /**
   * Listen for AI response stream chunks
   */
  onAIResponseStream(callback: AIResponseStreamCallback): void {
    this.socket.on(WebSocketEvent.AI_RESPONSE_STREAM, callback);
  }

  /**
   * Listen for AI response complete
   */
  onAIResponseComplete(callback: AIResponseCompleteCallback): void {
    this.socket.on(WebSocketEvent.AI_RESPONSE_COMPLETE, callback);
  }

  /**
   * Listen for errors
   */
  onError(callback: ErrorCallback): void {
    this.socket.on(WebSocketEvent.ERROR, callback);
  }

  // ============================================================================
  // Remove Listeners
  // ============================================================================

  /**
   * Remove specific listener
   */
  off(event: WebSocketEvent, callback?: (...args: unknown[]) => void): void {
    if (callback) {
      this.socket.off(event, callback);
    } else {
      this.socket.off(event);
    }
  }

  /**
   * Remove all listeners for all chat events
   */
  removeAllListeners(): void {
    this.socket.off(WebSocketEvent.JOINED_CONVERSATION);
    this.socket.off(WebSocketEvent.AI_TYPING);
    this.socket.off(WebSocketEvent.AI_RESPONSE_STREAM);
    this.socket.off(WebSocketEvent.AI_RESPONSE_COMPLETE);
    this.socket.off(WebSocketEvent.ERROR);
    console.log('[ChatSocket] All listeners removed');
  }
}

export default ChatSocket;
