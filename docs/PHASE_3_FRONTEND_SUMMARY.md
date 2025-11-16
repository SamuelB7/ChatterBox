# ✅ Sumário - Fase 3: Serviços e API Client

## 🎯 Status: COMPLETO

### Fase Implementada
- [x] Fase 3: Serviços e API Client (Axios)

## 📦 Arquivos Criados

### Estrutura de Arquivos
```
apps/web/src/
├── types/
│   └── api.types.ts                    # TypeScript interfaces para API
├── services/
│   └── api/
│       ├── client.ts                   # Axios instance configurada
│       ├── conversations.api.ts        # API de conversas
│       ├── messages.api.ts             # API de mensagens
│       └── index.ts                    # Central export point
```

---

## 📊 Implementação Detalhada

### 1. TypeScript Types (api.types.ts)

#### Conversation Types
```typescript
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
```

#### Message Types
```typescript
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
```

#### API Response Types
```typescript
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
```

#### Query Parameters
```typescript
export interface GetConversationsQuery {
  status?: 'active' | 'archived';
  limit?: number;
  page?: number;
}

export interface GetMessagesQuery {
  limit?: number;
  offset?: number;
}
```

**Total**: 9 interfaces exportadas

---

### 2. Axios Client (client.ts)

#### Configuração
```typescript
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});
```

#### Request Interceptor
- **Logging** em modo de desenvolvimento
- **Preparação** para autenticação (comentado para futuro)
- **Error handling** para erros de request

```typescript
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
        params: config.params,
        data: config.data,
      });
    }
    return config;
  },
  (error: AxiosError) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  },
);
```

#### Response Interceptor
- **Logging** de respostas em desenvolvimento
- **Error handling** global por status code:
  - 400 - Bad Request
  - 401 - Unauthorized (preparado para redirect para login)
  - 403 - Forbidden
  - 404 - Not Found
  - 500 - Server Error
- **Network error handling** (no response received)

```typescript
apiClient.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(`[API Response]`, response);
    }
    return response;
  },
  (error: AxiosError<ApiError>) => {
    const { status, data } = error.response || {};

    switch (status) {
      case 400: console.error('[Bad Request]', data?.message); break;
      case 401: console.error('[Unauthorized]'); break;
      case 404: console.error('[Not Found]', data?.message); break;
      case 500: console.error('[Server Error]', data?.message); break;
    }

    return Promise.reject(error);
  },
);
```

#### Helper Functions

**getErrorMessage()**
- Extrai mensagem de erro de qualquer tipo de erro
- Suporta AxiosError, Error, e unknown types
```typescript
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiError>;
    return axiosError.response?.data?.message || axiosError.message || 'An error occurred';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
}
```

**isErrorStatus()**
- Verifica se um erro é de um status code específico
```typescript
export function isErrorStatus(error: unknown, status: number): boolean {
  if (axios.isAxiosError(error)) {
    return error.response?.status === status;
  }
  return false;
}
```

---

### 3. Conversations API (conversations.api.ts)

#### Endpoints Implementados

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/conversations` | Criar nova conversa |
| GET | `/conversations` | Listar todas as conversas (com query params) |
| GET | `/conversations/:id` | Buscar conversa por ID |
| PATCH | `/conversations/:id/title` | Atualizar título da conversa |
| PATCH | `/conversations/:id/archive` | Arquivar conversa |
| PATCH | `/conversations/:id/unarchive` | Desarquivar conversa |
| DELETE | `/conversations/:id` | Deletar conversa |
| GET | `/conversations/stats` | Obter estatísticas (totalActive, totalArchived) |

**Total**: 8 endpoints

#### Exemplos de Uso

**Criar conversa:**
```typescript
const newConversation = await conversationsApi.create({
  title: 'Conversa sobre Terra Plana'
});
```

**Listar conversas ativas:**
```typescript
const conversations = await conversationsApi.getAll({
  status: 'active',
  limit: 50
});
```

**Atualizar título:**
```typescript
const updated = await conversationsApi.updateTitle(conversationId, {
  title: 'Novo Título'
});
```

**Obter estatísticas:**
```typescript
const stats = await conversationsApi.getStats();
console.log(`Active: ${stats.totalActive}, Archived: ${stats.totalArchived}`);
```

#### Exports

**Named exports** para conveniência:
```typescript
export {
  createConversation,
  getAllConversations,
  getConversationById,
  updateConversationTitle,
  archiveConversation,
  unarchiveConversation,
  deleteConversation,
  getConversationStats,
}
```

**Default export** para uso como objeto:
```typescript
export default conversationsApi;
```

---

### 4. Messages API (messages.api.ts)

#### Endpoints Implementados

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/messages/:conversationId` | Enviar mensagem do usuário |
| GET | `/messages/:conversationId` | Buscar todas as mensagens de uma conversa |
| GET | `/messages/message/:messageId` | Buscar mensagem por ID |
| GET | `/messages/:conversationId/last` | Buscar última mensagem da conversa |
| GET | `/messages/:conversationId/history` | Obter histórico formatado para IA |
| DELETE | `/messages/:messageId` | Deletar mensagem |

**Total**: 6 endpoints

#### Exemplos de Uso

**Enviar mensagem:**
```typescript
const message = await messagesApi.send(conversationId, {
  content: 'Por que a Terra é plana?'
});
```

**Buscar mensagens:**
```typescript
const messages = await messagesApi.getByConversation(conversationId, {
  limit: 50,
  offset: 0
});
```

**Buscar última mensagem:**
```typescript
const lastMsg = await messagesApi.getLastMessage(conversationId);
if (lastMsg) {
  console.log('Última mensagem:', lastMsg.content);
}
```

**Obter histórico para IA:**
```typescript
const history = await messagesApi.getHistory(conversationId, 50);
// Retorna: Array<{ role: 'user' | 'assistant', content: string }>
```

#### Error Handling Especial

**getLastMessage()** - Retorna `null` ao invés de lançar erro quando não há mensagens (404):
```typescript
async getLastMessage(conversationId: string): Promise<Message | null> {
  try {
    const response = await apiClient.get<Message>(`/messages/${conversationId}/last`);
    return response.data;
  } catch (error) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status?: number } };
      if (axiosError.response?.status === 404) {
        return null; // Sem mensagens
      }
    }
    throw error; // Re-throw outros erros
  }
}
```

#### Exports

**Named exports:**
```typescript
export {
  sendMessage,
  getMessagesByConversation,
  getMessageById,
  getLastMessage,
  getConversationHistory,
  deleteMessage,
}
```

**Default export:**
```typescript
export default messagesApi;
```

---

### 5. Central Export (index.ts)

Centraliza todas as exportações para facilitar imports:

```typescript
// Clients
export { default as apiClient, getErrorMessage, isErrorStatus } from './client';

// APIs
export { conversationsApi, default as conversationsApiDefault } from './conversations.api';
export { messagesApi, default as messagesApiDefault } from './messages.api';

// Named methods
export {
  createConversation,
  getAllConversations,
  // ... todos os métodos
} from './conversations.api';

export {
  sendMessage,
  getMessagesByConversation,
  // ... todos os métodos
} from './messages.api';

// Types
export type * from '@/types/api.types';
```

**Uso no código:**
```typescript
// Opção 1: Import específico
import { createConversation, sendMessage } from '@/services/api';

// Opção 2: Import do objeto
import { conversationsApi, messagesApi } from '@/services/api';

// Opção 3: Import do client
import { apiClient, getErrorMessage } from '@/services/api';
```

---

## 🔧 Erros Corrigidos

### Erro 1: TypeScript Import Verbatim Module Syntax
**Problema**: `AxiosInstance` e `InternalAxiosRequestConfig` devem ser type-only imports

**Solução**:
```typescript
// Antes
import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// Depois
import axios, { AxiosError } from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
```

### Erro 2: Property 'isAxiosError' does not exist on type 'AxiosInstance'
**Problema**: Tentativa de usar `apiClient.isAxiosError()`

**Solução**:
```typescript
// Antes
if (apiClient.isAxiosError && apiClient.isAxiosError(error)) {
  // ...
}

// Depois
if (error && typeof error === 'object' && 'response' in error) {
  const axiosError = error as { response?: { status?: number } };
  if (axiosError.response?.status === 404) {
    return null;
  }
}
```

---

## ✅ Testes Realizados

### Build Test
```bash
$ npm run build

> tsc -b && vite build

vite v7.2.2 building client environment for production...
transforming...
✓ 32 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.45 kB │ gzip:  0.29 kB
dist/assets/react-CHdo91hT.svg    4.13 kB │ gzip:  2.05 kB
dist/assets/index-Dl2J7pSa.css    6.14 kB │ gzip:  1.88 kB
dist/assets/index-Bo0tZObl.js   194.05 kB │ gzip: 60.96 kB
✓ built in 1.14s
```

**Status**: ✅ **SUCESSO**

### Lint Test
```bash
$ npm run lint

> eslint .
```

**Status**: ✅ **SUCESSO** (sem erros ou warnings)

---

## 📊 Estatísticas da Fase

### Arquivos Criados
- **Total**: 5 arquivos
  - 1 arquivo de types (`api.types.ts`)
  - 1 cliente Axios (`client.ts`)
  - 2 APIs (`conversations.api.ts`, `messages.api.ts`)
  - 1 index (`index.ts`)

### Código
- **Total de linhas**: ~450 linhas
- **Interfaces TypeScript**: 9
- **Endpoints REST API**: 14 (8 conversas + 6 mensagens)
- **Helper functions**: 2 (getErrorMessage, isErrorStatus)

### Funcionalidades
- ✅ Axios instance configurada
- ✅ Request/Response interceptors
- ✅ Global error handling
- ✅ Type-safe API calls
- ✅ 14 endpoints REST implementados
- ✅ Query parameters support
- ✅ Custom error handling (404 → null)
- ✅ Centralized exports
- ✅ Development logging

---

## 🎯 Próximos Passos (Fase 4)

### WebSocket Integration

**Arquivos a criar**:
- `src/services/websocket/socket.ts` - Socket.io client instance
- `src/services/websocket/chat.socket.ts` - Chat WebSocket service
- `src/types/websocket.types.ts` - WebSocket types

**Tarefas**:
- [ ] Configurar Socket.io client
- [ ] Implementar eventos (join:conversation, send:message, etc.)
- [ ] Implementar listeners (ai:typing, ai:response:stream, ai:response:complete)
- [ ] Adicionar reconnection logic
- [ ] Adicionar error handling
- [ ] Criar hook customizado (useWebSocket)

**Eventos WebSocket**:
| Evento | Direção | Descrição |
|--------|---------|-----------|
| `join:conversation` | Cliente → Server | Entrar em uma conversa |
| `leave:conversation` | Cliente → Server | Sair de uma conversa |
| `send:message` | Cliente → Server | Enviar mensagem |
| `ai:typing` | Server → Cliente | IA está digitando |
| `ai:response:stream` | Server → Cliente | Chunk de resposta da IA |
| `ai:response:complete` | Server → Cliente | Resposta completa |
| `error` | Server → Cliente | Erro no WebSocket |

---

**Status**: ✅ FASE 3 COMPLETA
**Tempo**: ~20 minutos
**Data**: 2025-11-13
**Build**: ✅ Sucesso (1.14s)
**Lint**: ✅ Sucesso (0 erros)
**Próxima Fase**: Fase 4 - WebSocket Integration

---

## 📚 Recursos Implementados

### API REST Completa

**Conversations** (8 endpoints):
- POST `/conversations` - Criar
- GET `/conversations` - Listar
- GET `/conversations/:id` - Buscar por ID
- PATCH `/conversations/:id/title` - Atualizar título
- PATCH `/conversations/:id/archive` - Arquivar
- PATCH `/conversations/:id/unarchive` - Desarquivar
- DELETE `/conversations/:id` - Deletar
- GET `/conversations/stats` - Estatísticas

**Messages** (6 endpoints):
- POST `/messages/:conversationId` - Enviar
- GET `/messages/:conversationId` - Listar
- GET `/messages/message/:messageId` - Buscar por ID
- GET `/messages/:conversationId/last` - Última mensagem
- GET `/messages/:conversationId/history` - Histórico para IA
- DELETE `/messages/:messageId` - Deletar

**Total**: 14 endpoints REST API completos e tipados
