/**
 * WebSocket Services Index
 * Central export point for all WebSocket services
 */

export { socketService, default as socketServiceDefault } from './socket.service';
export { ChatSocket, default as ChatSocketDefault } from './chat.socket';

// Re-export types
export type * from '@/types/websocket.types';
export { WebSocketEvent, ConnectionStatus } from '@/types/websocket.types';
