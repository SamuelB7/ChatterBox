/**
 * Socket.io Service
 * Manages WebSocket connection lifecycle
 */

import { io, Socket } from 'socket.io-client';
import { ConnectionStatus } from '@/types/websocket.types';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3000/chat';

class SocketService {
  private socket: Socket | null = null;
  private connectionStatus: ConnectionStatus = ConnectionStatus.DISCONNECTED;
  private statusListeners: Set<(status: ConnectionStatus) => void> = new Set();

  /**
   * Connect to WebSocket server
   */
  connect(): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.setStatus(ConnectionStatus.CONNECTING);

    this.socket = io(WS_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 10000,
    });

    this.setupEventListeners();

    return this.socket;
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.setStatus(ConnectionStatus.DISCONNECTED);
    }
  }

  /**
   * Get current socket instance
   */
  getSocket(): Socket | null {
    return this.socket;
  }

  /**
   * Check if socket is connected
   */
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  /**
   * Get current connection status
   */
  getStatus(): ConnectionStatus {
    return this.connectionStatus;
  }

  /**
   * Subscribe to connection status changes
   */
  onStatusChange(callback: (status: ConnectionStatus) => void): () => void {
    this.statusListeners.add(callback);
    // Return unsubscribe function
    return () => {
      this.statusListeners.delete(callback);
    };
  }

  /**
   * Setup socket event listeners
   */
  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('[WebSocket] Connected:', this.socket?.id);
      this.setStatus(ConnectionStatus.CONNECTED);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('[WebSocket] Disconnected:', reason);
      this.setStatus(ConnectionStatus.DISCONNECTED);
    });

    this.socket.on('reconnect_attempt', (attemptNumber) => {
      console.log('[WebSocket] Reconnect attempt:', attemptNumber);
      this.setStatus(ConnectionStatus.RECONNECTING);
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('[WebSocket] Reconnected after', attemptNumber, 'attempts');
      this.setStatus(ConnectionStatus.CONNECTED);
    });

    this.socket.on('reconnect_error', (error) => {
      console.error('[WebSocket] Reconnect error:', error);
      this.setStatus(ConnectionStatus.ERROR);
    });

    this.socket.on('reconnect_failed', () => {
      console.error('[WebSocket] Reconnect failed');
      this.setStatus(ConnectionStatus.ERROR);
    });

    this.socket.on('connect_error', (error) => {
      console.error('[WebSocket] Connection error:', error);
      this.setStatus(ConnectionStatus.ERROR);
    });

    this.socket.on('error', (error) => {
      console.error('[WebSocket] Socket error:', error);
    });
  }

  /**
   * Update connection status and notify listeners
   */
  private setStatus(status: ConnectionStatus): void {
    this.connectionStatus = status;
    this.statusListeners.forEach((listener) => listener(status));
  }
}

// Export singleton instance
export const socketService = new SocketService();
export default socketService;
