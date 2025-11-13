# ChatterBox 2.0 - Plano de Implementação Frontend

Este documento detalha o plano completo de implementação do frontend do ChatterBox 2.0 utilizando **React**, **Vite**, **TailwindCSS** e **Socket.io Client**.

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Stack Tecnológica](#stack-tecnológica)
3. [Estrutura de Diretórios](#estrutura-de-diretórios)
4. [Fase 1: Setup Inicial](#fase-1-setup-inicial)
5. [Fase 2: Configuração do TailwindCSS](#fase-2-configuração-do-tailwindcss)
6. [Fase 3: Serviços e API Client](#fase-3-serviços-e-api-client)
7. [Fase 4: WebSocket Integration](#fase-4-websocket-integration)
8. [Fase 5: Componentes de UI](#fase-5-componentes-de-ui)
9. [Fase 6: Páginas (Pages)](#fase-6-páginas-pages)
10. [Fase 7: Estado Global e Hooks](#fase-7-estado-global-e-hooks)
11. [Fase 8: Polimento e UX](#fase-8-polimento-e-ux)
12. [Fase 9: Docker e Build](#fase-9-docker-e-build)
13. [Design System](#design-system)
14. [Comandos Úteis](#comandos-úteis)

---

## 🎯 Visão Geral

O frontend do ChatterBox 2.0 é uma aplicação web SPA (Single Page Application) construída com React que:

- Exibe lista de conversas
- Permite criar novas conversas
- Exibe mensagens em formato de chat (user vs AI)
- Envia mensagens do usuário via REST API
- Recebe respostas da IA em tempo real via WebSocket (streaming)
- Possui design minimalista e consistente
- É responsivo para desktop e mobile

**Objetivo:** Interface simples e intuitiva para demonstrar conversas com IA que tenta convencer o usuário de que a Terra é plana.

---

## 🛠️ Stack Tecnológica

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| React | 18.x | Biblioteca UI |
| Vite | 5.x | Build tool (rápido) |
| TypeScript | 5.x | Linguagem |
| TailwindCSS | 3.x | Framework CSS utility-first |
| Socket.io Client | 4.x | WebSocket client |
| Axios | 1.x | HTTP client |
| React Router | 6.x | Roteamento SPA |
| Lucide React | latest | Ícones minimalistas |

---

## 📁 Estrutura de Diretórios

```
apps/web/
├── public/
│   └── favicon.ico
│
├── src/
│   ├── main.tsx                          # Entry point
│   ├── App.tsx                           # App component
│   ├── index.css                         # Global styles + Tailwind
│   ├── vite-env.d.ts                     # Vite types
│   │
│   ├── pages/                            # Páginas
│   │   ├── HomePage.tsx                  # Página inicial (lista de conversas)
│   │   ├── ConversationPage.tsx          # Página de conversa individual
│   │   └── NotFoundPage.tsx              # 404
│   │
│   ├── components/                       # Componentes reutilizáveis
│   │   ├── layout/
│   │   │   ├── Header.tsx                # Header da aplicação
│   │   │   ├── Sidebar.tsx               # Sidebar (lista de conversas)
│   │   │   └── Layout.tsx                # Layout wrapper
│   │   │
│   │   ├── chat/
│   │   │   ├── ChatWindow.tsx            # Container do chat
│   │   │   ├── MessageList.tsx           # Lista de mensagens
│   │   │   ├── MessageItem.tsx           # Item de mensagem individual
│   │   │   ├── MessageInput.tsx          # Input para enviar mensagens
│   │   │   └── TypingIndicator.tsx       # Indicador "AI is typing..."
│   │   │
│   │   ├── conversations/
│   │   │   ├── ConversationList.tsx      # Lista de conversas
│   │   │   ├── ConversationItem.tsx      # Item de conversa
│   │   │   └── NewConversationButton.tsx # Botão para nova conversa
│   │   │
│   │   └── ui/                           # Componentes básicos de UI
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Card.tsx
│   │       ├── Spinner.tsx
│   │       └── EmptyState.tsx
│   │
│   ├── services/                         # Camada de serviços
│   │   ├── api/
│   │   │   ├── client.ts                 # Axios instance configurada
│   │   │   ├── conversations.api.ts      # API de conversas
│   │   │   └── messages.api.ts           # API de mensagens
│   │   │
│   │   └── websocket/
│   │       ├── socket.ts                 # Socket.io client instance
│   │       └── chat.socket.ts            # Socket event handlers
│   │
│   ├── hooks/                            # Custom React hooks
│   │   ├── useConversations.ts           # Hook para gerenciar conversas
│   │   ├── useMessages.ts                # Hook para gerenciar mensagens
│   │   ├── useSocket.ts                  # Hook para WebSocket
│   │   └── useAutoScroll.ts              # Hook para scroll automático
│   │
│   ├── context/                          # Context API
│   │   └── ChatContext.tsx               # Estado global do chat
│   │
│   ├── types/                            # TypeScript types
│   │   ├── conversation.types.ts
│   │   ├── message.types.ts
│   │   └── websocket.types.ts
│   │
│   └── utils/                            # Funções utilitárias
│       ├── date.utils.ts                 # Formatação de datas
│       ├── string.utils.ts               # Manipulação de strings
│       └── constants.ts                  # Constantes da aplicação
│
├── .env.example                          # Exemplo de variáveis de ambiente
├── .eslintrc.cjs                         # ESLint config
├── .prettierrc                           # Prettier config
├── index.html                            # HTML template
├── vite.config.ts                        # Vite config
├── tailwind.config.js                    # Tailwind config
├── postcss.config.js                     # PostCSS config
├── tsconfig.json                         # TypeScript config
├── tsconfig.node.json                    # TypeScript config for Node
├── package.json                          # Dependências
├── Dockerfile                            # Docker image
└── README.md                             # Documentação
```

---

## 🚀 Fase 1: Setup Inicial

### 1.1 Criar Projeto com Vite

```bash
# Na raiz do monorepo
mkdir -p apps/web
cd apps/web

# Criar projeto React + TypeScript com Vite
npm create vite@latest . -- --template react-ts
```

### 1.2 Instalar Dependências

```bash
# Dependências principais
npm install react-router-dom
npm install axios
npm install socket.io-client
npm install lucide-react

# TailwindCSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Dependências de desenvolvimento
npm install -D @types/node
npm install -D eslint-plugin-react-hooks
```

### 1.3 Configurar Variáveis de Ambiente

**.env.example:**
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
VITE_WS_URL=http://localhost:3000/chat

# App Configuration
VITE_APP_NAME=ChatterBox 2.0
```

**.env:**
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_WS_URL=http://localhost:3000/chat
VITE_APP_NAME=ChatterBox 2.0
```

### 1.4 Configurar Vite

**vite.config.ts:**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@services': path.resolve(__dirname, './src/services'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@types': path.resolve(__dirname, './src/types'),
      '@utils': path.resolve(__dirname, './src/utils'),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
});
```

### 1.5 Configurar TypeScript

**tsconfig.json:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    /* Path mapping */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@pages/*": ["./src/pages/*"],
      "@services/*": ["./src/services/*"],
      "@hooks/*": ["./src/hooks/*"],
      "@types/*": ["./src/types/*"],
      "@utils/*": ["./src/utils/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 1.6 Configurar ESLint e Prettier

**.eslintrc.cjs:**
```javascript
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    '@typescript-eslint/no-explicit-any': 'warn',
  },
};
```

**.prettierrc:**
```json
{
  "singleQuote": true,
  "trailingComma": "all",
  "tabWidth": 2,
  "semi": true,
  "printWidth": 100,
  "arrowParens": "always"
}
```

---

## 🎨 Fase 2: Configuração do TailwindCSS

### 2.1 Configurar Tailwind

**tailwind.config.js:**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

### 2.2 Configurar CSS Global

**src/index.css:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    @apply border-gray-200;
  }

  body {
    @apply bg-gray-50 text-gray-900 antialiased;
  }

  #root {
    @apply h-screen w-screen overflow-hidden;
  }
}

@layer components {
  /* Scrollbar personalizado */
  .custom-scrollbar::-webkit-scrollbar {
    @apply w-2;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    @apply bg-gray-100;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    @apply bg-gray-300 rounded-full;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    @apply bg-gray-400;
  }

  /* Animações */
  .fade-in {
    animation: fadeIn 0.3s ease-in;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .typing-indicator span {
    animation: typing 1.4s infinite;
  }

  .typing-indicator span:nth-child(2) {
    animation-delay: 0.2s;
  }

  .typing-indicator span:nth-child(3) {
    animation-delay: 0.4s;
  }

  @keyframes typing {
    0%, 60%, 100% {
      opacity: 0.3;
    }
    30% {
      opacity: 1;
    }
  }
}
```

---

## ✅ Fase 3: Serviços e API Client [COMPLETO]

### 3.1 Criar Types

**src/types/conversation.types.ts:**
```typescript
export interface IConversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  status: 'active' | 'archived';
  lastMessage?: IMessage;
}

export interface ICreateConversationDto {
  title?: string;
  initialMessage?: string;
}

export interface IPagination {
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface IPaginatedConversations {
  conversations: IConversation[];
  pagination: IPagination;
}
```

**src/types/message.types.ts:**
```typescript
export interface IMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  metadata?: {
    model?: string;
    tokensUsed?: number;
    processingTime?: number;
  };
}

export interface ISendMessageDto {
  content: string;
}

export interface IPaginatedMessages {
  messages: IMessage[];
  pagination: IPagination;
}
```

**src/types/websocket.types.ts:**
```typescript
export enum WebSocketEvent {
  JOIN_CONVERSATION = 'join:conversation',
  LEAVE_CONVERSATION = 'leave:conversation',
  JOINED_CONVERSATION = 'joined:conversation',
  AI_TYPING = 'ai:typing',
  AI_RESPONSE_STREAM = 'ai:response:stream',
  AI_RESPONSE_COMPLETE = 'ai:response:complete',
  ERROR = 'error',
}

export interface AITypingPayload {
  conversationId: string;
  isTyping: boolean;
}

export interface AIResponseStreamPayload {
  conversationId: string;
  messageId: string;
  chunk: string;
  isComplete: boolean;
}

export interface AIResponseCompletePayload {
  conversationId: string;
  message: IMessage;
}
```

### 3.2 Configurar Axios Client

**src/services/api/client.ts:**
```typescript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 segundos
});

// Request interceptor (para adicionar tokens no futuro)
apiClient.interceptors.request.use(
  (config) => {
    // Adicionar token de autenticação aqui no futuro
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor (para tratamento de erros)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  },
);
```

### 3.3 API de Conversas

**src/services/api/conversations.api.ts:**
```typescript
import { apiClient } from './client';
import { IConversation, ICreateConversationDto, IPaginatedConversations } from '@types/conversation.types';

export const conversationsAPI = {
  /**
   * Criar nova conversa
   */
  create: async (data: ICreateConversationDto = {}): Promise<IConversation> => {
    const response = await apiClient.post<IConversation>('/conversations', data);
    return response.data;
  },

  /**
   * Listar todas as conversas
   */
  getAll: async (page: number = 1, limit: number = 20): Promise<IPaginatedConversations> => {
    const response = await apiClient.get<IPaginatedConversations>('/conversations', {
      params: { page, limit, status: 'active' },
    });
    return response.data;
  },

  /**
   * Buscar conversa por ID
   */
  getById: async (id: string): Promise<IConversation> => {
    const response = await apiClient.get<IConversation>(`/conversations/${id}`);
    return response.data;
  },

  /**
   * Deletar conversa
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/conversations/${id}`);
  },
};
```

### 3.4 API de Mensagens

**src/services/api/messages.api.ts:**
```typescript
import { apiClient } from './client';
import { IMessage, ISendMessageDto, IPaginatedMessages } from '@types/message.types';

export const messagesAPI = {
  /**
   * Enviar mensagem do usuário
   */
  send: async (conversationId: string, data: ISendMessageDto): Promise<{ userMessage: IMessage; conversationId: string }> => {
    const response = await apiClient.post(`/conversations/${conversationId}/messages`, data);
    return response.data;
  },

  /**
   * Buscar mensagens de uma conversa
   */
  getByConversation: async (
    conversationId: string,
    page: number = 1,
    limit: number = 50,
  ): Promise<IPaginatedMessages> => {
    const response = await apiClient.get<IPaginatedMessages>(
      `/conversations/${conversationId}/messages`,
      {
        params: { page, limit },
      },
    );
    return response.data;
  },
};
```

---

## 🔌 Fase 4: WebSocket Integration

### 4.1 Criar Socket Client

**src/services/websocket/socket.ts:**
```typescript
import { io, Socket } from 'socket.io-client';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3000/chat';

class SocketService {
  private socket: Socket | null = null;

  connect(): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(WS_URL, {
      transports: ['websocket'],
      autoConnect: true,
    });

    this.socket.on('connect', () => {
      console.log('✅ WebSocket connected:', this.socket?.id);
    });

    this.socket.on('disconnect', () => {
      console.log('❌ WebSocket disconnected');
    });

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }
}

export const socketService = new SocketService();
```

### 4.2 Criar Chat Socket Handlers

**src/services/websocket/chat.socket.ts:**
```typescript
import { Socket } from 'socket.io-client';
import { WebSocketEvent } from '@types/websocket.types';

export class ChatSocket {
  constructor(private socket: Socket) {}

  /**
   * Entrar em uma conversa
   */
  joinConversation(conversationId: string): void {
    this.socket.emit(WebSocketEvent.JOIN_CONVERSATION, { conversationId });
  }

  /**
   * Sair de uma conversa
   */
  leaveConversation(conversationId: string): void {
    this.socket.emit(WebSocketEvent.LEAVE_CONVERSATION, { conversationId });
  }

  /**
   * Escutar evento de "joined conversation"
   */
  onJoinedConversation(callback: (data: any) => void): void {
    this.socket.on(WebSocketEvent.JOINED_CONVERSATION, callback);
  }

  /**
   * Escutar typing indicator
   */
  onAITyping(callback: (data: { conversationId: string; isTyping: boolean }) => void): void {
    this.socket.on(WebSocketEvent.AI_TYPING, callback);
  }

  /**
   * Escutar stream de resposta da IA
   */
  onAIResponseStream(
    callback: (data: {
      conversationId: string;
      messageId: string;
      chunk: string;
      isComplete: boolean;
    }) => void,
  ): void {
    this.socket.on(WebSocketEvent.AI_RESPONSE_STREAM, callback);
  }

  /**
   * Escutar resposta completa da IA
   */
  onAIResponseComplete(callback: (data: { conversationId: string; message: any }) => void): void {
    this.socket.on(WebSocketEvent.AI_RESPONSE_COMPLETE, callback);
  }

  /**
   * Escutar erros
   */
  onError(callback: (data: { error: string; message: string }) => void): void {
    this.socket.on(WebSocketEvent.ERROR, callback);
  }

  /**
   * Remover todos os listeners
   */
  removeAllListeners(): void {
    this.socket.removeAllListeners();
  }
}
```

---

## 🧩 Fase 5: Componentes de UI

### 5.1 Componentes Básicos

**src/components/ui/Button.tsx:**
```typescript
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/string.utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-400',
      ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-300',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
```

**src/components/ui/Input.tsx:**
```typescript
import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/string.utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors',
            error ? 'border-red-500' : 'border-gray-300',
            className,
          )}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';
```

**src/components/ui/Spinner.tsx:**
```typescript
export const Spinner = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizes[size]} border-gray-300 border-t-primary-600 rounded-full animate-spin`}
      />
    </div>
  );
};
```

**src/components/ui/EmptyState.tsx:**
```typescript
import { MessageSquare } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
}

export const EmptyState = ({ icon, title, description }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4">
      <div className="text-gray-400 mb-4">
        {icon || <MessageSquare size={64} />}
      </div>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
      {description && <p className="text-sm text-gray-500">{description}</p>}
    </div>
  );
};
```

### 5.2 Componentes de Chat

**src/components/chat/TypingIndicator.tsx:**
```typescript
export const TypingIndicator = () => {
  return (
    <div className="flex items-center space-x-2 px-4 py-3 bg-gray-100 rounded-lg w-fit">
      <span className="text-sm text-gray-600">IA está digitando</span>
      <div className="typing-indicator flex space-x-1">
        <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
        <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
        <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
      </div>
    </div>
  );
};
```

**src/components/chat/MessageItem.tsx:**
```typescript
import { IMessage } from '@types/message.types';
import { formatMessageTime } from '@/utils/date.utils';
import { User, Bot } from 'lucide-react';

interface MessageItemProps {
  message: IMessage;
}

export const MessageItem = ({ message }: MessageItemProps) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 fade-in`}>
      <div className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end max-w-[70%]`}>
        {/* Avatar */}
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            isUser ? 'bg-primary-600 ml-2' : 'bg-gray-300 mr-2'
          }`}
        >
          {isUser ? (
            <User size={18} className="text-white" />
          ) : (
            <Bot size={18} className="text-gray-700" />
          )}
        </div>

        {/* Message bubble */}
        <div>
          <div
            className={`px-4 py-2 rounded-2xl ${
              isUser
                ? 'bg-primary-600 text-white rounded-br-sm'
                : 'bg-gray-200 text-gray-900 rounded-bl-sm'
            }`}
          >
            <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
          </div>
          <span className="text-xs text-gray-500 mt-1 block">
            {formatMessageTime(message.timestamp)}
          </span>
        </div>
      </div>
    </div>
  );
};
```

**src/components/chat/MessageList.tsx:**
```typescript
import { useRef, useEffect } from 'react';
import { IMessage } from '@types/message.types';
import { MessageItem } from './MessageItem';
import { TypingIndicator } from './TypingIndicator';
import { EmptyState } from '@components/ui/EmptyState';
import { MessageSquare } from 'lucide-react';

interface MessageListProps {
  messages: IMessage[];
  isTyping: boolean;
}

export const MessageList = ({ messages, isTyping }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  if (messages.length === 0) {
    return (
      <EmptyState
        icon={<MessageSquare size={64} />}
        title="Nenhuma mensagem ainda"
        description="Envie uma mensagem para começar a conversa"
      />
    );
  }

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-6">
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
      {isTyping && <TypingIndicator />}
      <div ref={messagesEndRef} />
    </div>
  );
};
```

**src/components/chat/MessageInput.tsx:**
```typescript
import { useState, FormEvent, KeyboardEvent } from 'react';
import { Button } from '@components/ui/Button';
import { Send } from 'lucide-react';

interface MessageInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
}

export const MessageInput = ({ onSend, disabled }: MessageInputProps) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4 bg-white">
      <div className="flex items-end space-x-2">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Digite sua mensagem..."
          disabled={disabled}
          rows={1}
          className="flex-1 resize-none px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 max-h-32"
        />
        <Button type="submit" disabled={!message.trim() || disabled} size="md">
          <Send size={20} />
        </Button>
      </div>
      <p className="text-xs text-gray-500 mt-2">Pressione Enter para enviar, Shift+Enter para nova linha</p>
    </form>
  );
};
```

**src/components/chat/ChatWindow.tsx:**
```typescript
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { IMessage } from '@types/message.types';

interface ChatWindowProps {
  messages: IMessage[];
  isTyping: boolean;
  onSendMessage: (content: string) => void;
  isLoading?: boolean;
}

export const ChatWindow = ({ messages, isTyping, onSendMessage, isLoading }: ChatWindowProps) => {
  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm">
      <MessageList messages={messages} isTyping={isTyping} />
      <MessageInput onSend={onSendMessage} disabled={isLoading} />
    </div>
  );
};
```

---

## 📄 Fase 6: Páginas (Pages)

### 6.1 Home Page

**src/pages/HomePage.tsx:**
```typescript
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { conversationsAPI } from '@services/api/conversations.api';
import { IConversation } from '@types/conversation.types';
import { Button } from '@components/ui/Button';
import { Spinner } from '@components/ui/Spinner';
import { EmptyState } from '@components/ui/EmptyState';
import { Plus, MessageSquare } from 'lucide-react';
import { formatRelativeTime } from '@/utils/date.utils';

export const HomePage = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const data = await conversationsAPI.getAll();
      setConversations(data.conversations);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateConversation = async () => {
    try {
      setCreating(true);
      const newConversation = await conversationsAPI.create();
      navigate(`/conversation/${newConversation.id}`);
    } catch (error) {
      console.error('Error creating conversation:', error);
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Conversas</h1>
        <Button onClick={handleCreateConversation} disabled={creating} size="lg">
          <Plus size={20} className="mr-2" />
          Nova Conversa
        </Button>
      </div>

      {conversations.length === 0 ? (
        <EmptyState
          icon={<MessageSquare size={80} />}
          title="Nenhuma conversa ainda"
          description="Clique em 'Nova Conversa' para começar"
        />
      ) : (
        <div className="space-y-4">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => navigate(`/conversation/${conv.id}`)}
              className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{conv.title}</h3>
                  <p className="text-sm text-gray-600">{conv.messageCount} mensagens</p>
                </div>
                <span className="text-xs text-gray-500">{formatRelativeTime(conv.updatedAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

### 6.2 Conversation Page

**src/pages/ConversationPage.tsx:**
```typescript
import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { messagesAPI } from '@services/api/messages.api';
import { conversationsAPI } from '@services/api/conversations.api';
import { socketService } from '@services/websocket/socket';
import { ChatSocket } from '@services/websocket/chat.socket';
import { IMessage } from '@types/message.types';
import { ChatWindow } from '@components/chat/ChatWindow';
import { Spinner } from '@components/ui/Spinner';
import { Button } from '@components/ui/Button';
import { ArrowLeft } from 'lucide-react';

export const ConversationPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [streamingMessage, setStreamingMessage] = useState<{
    id: string;
    content: string;
  } | null>(null);

  useEffect(() => {
    if (!id) return;

    loadConversation();
    loadMessages();
    setupWebSocket();

    return () => {
      const socket = socketService.getSocket();
      if (socket && id) {
        const chatSocket = new ChatSocket(socket);
        chatSocket.leaveConversation(id);
        chatSocket.removeAllListeners();
      }
    };
  }, [id]);

  const loadConversation = async () => {
    try {
      const conversation = await conversationsAPI.getById(id!);
      setTitle(conversation.title);
    } catch (error) {
      console.error('Error loading conversation:', error);
      navigate('/');
    }
  };

  const loadMessages = async () => {
    try {
      const data = await messagesAPI.getByConversation(id!);
      setMessages(data.messages);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupWebSocket = () => {
    const socket = socketService.connect();
    const chatSocket = new ChatSocket(socket);

    chatSocket.joinConversation(id!);

    chatSocket.onAITyping(({ isTyping }) => {
      setIsTyping(isTyping);
    });

    chatSocket.onAIResponseStream(({ messageId, chunk, isComplete }) => {
      if (isComplete) {
        setStreamingMessage(null);
      } else {
        setStreamingMessage((prev) => ({
          id: messageId,
          content: (prev?.content || '') + chunk,
        }));
      }
    });

    chatSocket.onAIResponseComplete(({ message }) => {
      setMessages((prev) => [...prev, message]);
      setStreamingMessage(null);
      setIsTyping(false);
    });

    chatSocket.onError(({ message: errorMessage }) => {
      console.error('WebSocket error:', errorMessage);
      setIsTyping(false);
    });
  };

  const handleSendMessage = async (content: string) => {
    try {
      const { userMessage } = await messagesAPI.send(id!, { content });
      setMessages((prev) => [...prev, userMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  const displayMessages = streamingMessage
    ? [
        ...messages,
        {
          id: streamingMessage.id,
          conversationId: id!,
          role: 'assistant' as const,
          content: streamingMessage.content,
          timestamp: new Date().toISOString(),
        },
      ]
    : messages;

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center">
        <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="mr-4">
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
      </div>

      {/* Chat */}
      <div className="flex-1 overflow-hidden p-4">
        <ChatWindow
          messages={displayMessages}
          isTyping={isTyping}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
};
```

---

## 🪝 Fase 7: Estado Global e Hooks

### 7.1 Utils

**src/utils/string.utils.ts:**
```typescript
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
```

**src/utils/date.utils.ts:**
```typescript
export function formatMessageTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

export function formatRelativeTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d atrás`;
  if (hours > 0) return `${hours}h atrás`;
  if (minutes > 0) return `${minutes}min atrás`;
  return 'agora';
}
```

---

## 🎨 Fase 8: Polimento e UX

### 8.1 App.tsx e Routing

**src/App.tsx:**
```typescript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from '@pages/HomePage';
import { ConversationPage } from '@pages/ConversationPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/conversation/:id" element={<ConversationPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

**src/main.tsx:**
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

---

## 🐳 Fase 9: Docker e Build

### 9.1 Dockerfile

**apps/web/Dockerfile:**
```dockerfile
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source
COPY . .

# Build application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 9.2 Nginx Config

**apps/web/nginx.conf:**
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

### 9.3 Atualizar docker-compose.yml

Adicionar ao **docker-compose.yml** da raiz:

```yaml
  web:
    build:
      context: ./apps/web
      dockerfile: Dockerfile
    container_name: chatterbox-web
    restart: unless-stopped
    ports:
      - '5173:80'
    depends_on:
      - api
    networks:
      - chatterbox-network
```

---

## 🎨 Design System

### Paleta de Cores

- **Primary:** Blue (#0ea5e9)
- **Gray:** Neutral grays
- **Success:** Green (#10b981)
- **Error:** Red (#ef4444)
- **Warning:** Yellow (#f59e0b)

### Typography

- **Font:** Inter
- **Sizes:** xs (12px), sm (14px), base (16px), lg (18px), xl (20px)

### Spacing

- Usa sistema de spacing do Tailwind (4px base)
- Padding: 4, 8, 12, 16, 24, 32px
- Margins: 4, 8, 16, 24, 32px

---

## 🎯 Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Preview
npm run preview

# Lint
npm run lint

# Docker
docker build -t chatterbox-web ./apps/web
docker run -p 5173:80 chatterbox-web
```

---

## ✅ Checklist de Implementação

- [x] Fase 1: Setup inicial (Vite + React + TypeScript) ✅
- [x] Fase 2: TailwindCSS configurado ✅
- [x] Fase 3: API client (Axios) configurado ✅
- [ ] Fase 4: WebSocket (Socket.io) integrado
- [ ] Fase 5: Componentes de UI criados
- [ ] Fase 6: Páginas criadas (Home + Conversation)
- [ ] Fase 7: Hooks e utils implementados
- [ ] Fase 8: UX polida (animações, loading states)
- [ ] Fase 9: Docker e build configurados
- [ ] Design responsivo testado
- [ ] Streaming de mensagens funcionando
- [ ] Typing indicator funcionando

## 📊 Status Atual do Frontend

**Data de Início**: 2025-11-13
**Status**: **Em Progresso** (3/9 fases completas - 33%)

### ✅ Fase 1 - Setup Inicial (COMPLETO)
- Vite + React 18 + TypeScript configurado
- Dependências instaladas: react-router-dom, axios, socket.io-client, lucide-react
- Variáveis de ambiente configuradas (.env)
- Path aliases (`@/`) configurados
- Build testado e funcionando

### ✅ Fase 2 - TailwindCSS (COMPLETO)
- TailwindCSS v3 instalado e configurado
- PostCSS configurado
- Custom styles: scrollbar, animations (slideIn, typing)
- Tema customizado (primary colors, Inter font)
- Build com Tailwind funcionando

### ✅ Fase 3 - Serviços e API Client (COMPLETO)
- Axios client configurado com interceptors
- TypeScript types para API (Conversation, Message, ApiError)
- Conversations API (8 endpoints: create, getAll, getById, updateTitle, archive, unarchive, delete, getStats)
- Messages API (6 endpoints: send, getByConversation, getById, getLastMessage, getHistory, delete)
- Error handling com getErrorMessage() e isErrorStatus()
- Centralized exports via index.ts
- Build e lint passando sem erros

### ⏳ Próximas Fases
- Fase 4: WebSocket Integration
- Fase 5: Componentes de UI
- Fase 6: Páginas (HomePage, ConversationPage)
- Fase 7: Estado Global e Hooks
- Fase 8: Polimento e UX
- Fase 9: Docker e Build

---

**Versão:** 1.2 (Fases 1, 2 e 3 Completas)
**Última atualização:** 2025-11-13
**Stack:** React 18 + Vite 7 + TailwindCSS 3 + Socket.io Client 4 + Axios 1
**Build Status**: ✅ Passing (1.14s)
**Lint Status**: ✅ Passing
**Total Dependências**: 308 packages
