# ChatterBox 2.0

Sistema de conversação com IA desenvolvido com NestJS, MongoDB e Google Gemini AI. Esta é uma prova de conceito (POC) onde a IA tem o objetivo de convencer o usuário de que a Terra é plana.

## 🏗️ Estrutura do Projeto (Monorepo)

```
ChatterBox/
├── apps/
│   ├── api/                    # Backend (NestJS + MongoDB)
│   └── web/                    # Frontend (React + Vite) - A ser implementado
├── docs/                       # Documentações técnicas e resumos das fases
├── docker compose .yml          # Orquestração de containers
└── README.md
```

## 🚀 Tecnologias

### Backend
- **NestJS** 10.x - Framework backend
- **MongoDB** 7.x - Banco de dados NoSQL
- **Mongoose** 8.x - ODM
- **Google Gemini AI** - Integração de IA
- **Socket.io** 4.x - WebSocket para mensagens em tempo real
- **Swagger** - Documentação automática da API
- **Jest** - Framework de testes

### Frontend
- **React** 19.x
- **Vite** 7.x
- **TailwindCSS** 3.x
- **Socket.io Client** 4.x
- **React Router** 7.x
- **Axios** 1.x

## 📋 Pré-requisitos

- Node.js 20.x ou superior
- Docker e Docker Compose (recomendado)
- Chave de API do Google Gemini ([Obter aqui](https://makersuite.google.com/app/apikey))

## 🔧 Instalação e Configuração

### 1. Clonar o repositório

```bash
git clone <repository-url>
cd ChatterBox
```

### 2. Configurar variáveis de ambiente

```bash
# Raiz do projeto
cp .env.example .env
# Editar .env e adicionar sua GEMINI_API_KEY

# Backend
cd apps/api
cp .env.example .env
# Editar .env se necessário

# Frontend
cd apps/web
cp .env.example .env
# Editar .env se necessário
```

### 3. Instalar dependências

```bash
# Backend
cd apps/api
npm install

# Frontend
cd apps/web
npm install
```

## 🏃 Executando a aplicação

### Opção 1: Com Docker (Recomendado) 🐳

**Rode toda a aplicação (frontend + backend + banco) com um único comando:**

```bash
# Na raiz do projeto
docker compose up --build

# Ou em background (detached mode)
docker compose up -d --build
```

**Serviços disponíveis:**
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api
- **Swagger Docs**: http://localhost:3000/api/docs
- **Health Check**: http://localhost:3000/health
- **MongoDB**: localhost:27017 (admin/admin123)

**Para mais detalhes sobre Docker, veja**: [DOCKER_SETUP.md](./DOCKER_SETUP.md)

**Comandos úteis:**
```bash
# Ver logs
docker compose  logs -f

# Parar serviços
docker compose  down

# Limpar tudo (incluindo volumes)
docker compose  down -v
```

### Opção 2: Localmente (Desenvolvimento)

1. **Iniciar MongoDB** (via Docker):
```bash
docker run -d -p 27017:27017 --name mongodb mongo:7
```

2. **Iniciar Backend**:
```bash
cd apps/api
npm run start:dev
```

## 📚 Documentação da API

Após iniciar a aplicação, acesse:
- **Swagger UI**: http://localhost:3000/api/docs
- **Health Check**: http://localhost:3000/api/health

## 🧪 Testes

```bash
cd apps/api

# Testes unitários
npm run test

# Testes com watch
npm run test:watch

# Cobertura
npm run test:cov
```

## 📖 Documentação Técnica

- **[PROJECT_STATUS.md](./docs/PROJECT_STATUS.md)** - Status geral do projeto e progresso de todas as fases
- **[DTOS_CONTRACTS.md](./docs/DTOS_CONTRACTS.md)** - Contratos de API, DTOs e eventos WebSocket
- **[IMPLEMENTATION_PLAN_BACKEND.md](./docs/IMPLEMENTATION_PLAN_BACKEND.md)** - Plano detalhado do backend
- **[IMPLEMENTATION_PLAN_FRONTEND.md](./docs/IMPLEMENTATION_PLAN_FRONTEND.md)** - Plano detalhado do frontend

## 🎯 Status da Implementação

**Backend**: 6/6 fases completas (100%) ✅
**Frontend**: 6/9 fases completas (67%) ✅
**Docker**: Configurado e funcional ✅

### ✅ Fase 1 - Setup Inicial Backend (COMPLETO)
- [x] Estrutura de diretórios criada
- [x] NestJS configurado
- [x] TypeScript, ESLint e Prettier configurados
- [x] MongoDB integrado via Mongoose
- [x] Swagger configurado
- [x] Docker e docker compose  configurados
- [x] Scripts npm configurados
- [x] Build testado e funcionando

### ✅ Fase 2 - Módulo de Conversas (COMPLETO)
- [x] Conversation Schema (MongoDB)
- [x] DTOs (Create, Response, Paginated)
- [x] ConversationRepository (Repository Pattern)
- [x] ConversationsService (8 métodos)
- [x] ConversationsController (7 endpoints REST)
- [x] ConversationsModule
- [x] Swagger documentation
- [x] 7 endpoints funcionais

### ✅ Fase 3 - Módulo de Mensagens (COMPLETO)
- [x] Message Schema (MongoDB)
- [x] DTOs (Send, Response, Paginated)
- [x] MessageRepository (8 métodos)
- [x] MessagesService (7 métodos)
- [x] MessagesController (4 endpoints REST)
- [x] MessagesModule
- [x] Integração com ConversationsModule
- [x] Auto-increment messageCount

### ✅ Fase 4 - Integração Google Gemini AI (COMPLETO)
- [x] AIService com Google Gemini SDK
- [x] Flat Earth System Prompt
- [x] generateResponse() - Resposta completa
- [x] generateResponseStream() - Streaming com AsyncGenerator
- [x] healthCheck() - Verificação do serviço
- [x] AIModule exportando serviço
- [x] Error handling robusto

### ✅ Fase 5 - WebSocket Gateway (COMPLETO)
- [x] ChatGateway com Socket.io
- [x] ChatService para orquestração
- [x] Eventos: join:conversation, send:message, leave:conversation
- [x] Streaming de respostas em tempo real
- [x] Typing indicators (ai:typing)
- [x] Integração completa (Messages + AI)
- [x] ChatModule integrado ao AppModule

### ✅ Fase 6 - Testes Unitários (COMPLETO)
- [x] 50 testes unitários implementados
- [x] ConversationsService (13 testes)
- [x] MessagesService (15 testes)
- [x] AIService (6 testes)
- [x] ChatService (16 testes)
- [x] 100% de sucesso nos testes

---

**Frontend**: 6/9 fases completas (67%) ✅

### ✅ Fase 1 & 2 - Setup + TailwindCSS (COMPLETO)
- [x] Vite + React 19 + TypeScript configurado
- [x] TailwindCSS v3 configurado
- [x] Dependências instaladas
- [x] Path aliases configurados
- [x] Animações customizadas

### ✅ Fase 3 - API Client (COMPLETO)
- [x] Axios client com interceptors
- [x] Conversations API (8 endpoints)
- [x] Messages API (6 endpoints)
- [x] TypeScript types completos

### ✅ Fase 4 - WebSocket Integration (COMPLETO)
- [x] Socket.io client configurado
- [x] SocketService (connection manager)
- [x] ChatSocket (event wrapper)
- [x] Reconnection automático

### ✅ Fase 5 - UI Components (COMPLETO)
- [x] 14 componentes React
- [x] UI básicos (4)
- [x] Chat components (5)
- [x] Conversation components (3)
- [x] Layout components (3)

### ✅ Fase 6 - Pages & Routing (COMPLETO)
- [x] React Router v7
- [x] HomePage (lista de conversas)
- [x] ConversationPage (chat completo)
- [x] NotFoundPage (404)
- [x] WebSocket real-time funcionando

### 🔄 Fases Restantes (Opcionais)
- [ ] Fase 7 - Estado Global e Hooks
- [ ] Fase 8 - Polimento e UX
- [x] Fase 9 - Docker e Build ✅

## 📊 Recursos Implementados

### REST API (11 endpoints)
- **Conversas**: 7 endpoints (criar, listar, detalhes, editar, arquivar, deletar, stats)
- **Mensagens**: 4 endpoints (enviar, listar, última, deletar)
- **Documentação**: Swagger UI completa em `/api/docs`

### WebSocket API (Namespace: `/chat`)
**Eventos do Cliente**:
- `join:conversation` - Entrar em uma conversa
- `send:message` - Enviar mensagem (com streaming de resposta)
- `leave:conversation` - Sair da conversa

**Eventos do Servidor**:
- `joined:conversation` - Confirmação de entrada
- `message:saved` - Mensagem do usuário salva
- `ai:typing` - Status de digitação da IA
- `ai:response:stream` - Chunks da resposta em tempo real
- `ai:response:complete` - Resposta completa com metadata
- `left:conversation` - Confirmação de saída
- `error` - Erros de processamento

### Integração com IA
- ✅ Google Gemini AI (modelo: gemini-pro)
- ✅ Streaming de respostas em tempo real
- ✅ Contexto de conversa mantido
- ✅ Prompt "Flat Earth" customizado
- ✅ Metadata tracking (tempo de processamento, tokens)

### Banco de Dados
- ✅ MongoDB com Mongoose ODM
- ✅ 2 collections (conversations, messages)
- ✅ Índices otimizados para queries
- ✅ Repository Pattern implementado

### Qualidade de Código
- ✅ TypeScript Strict Mode
- ✅ ESLint configurado (0 warnings)
- ✅ Prettier configurado
- ✅ Build sem erros
- ✅ Dependency Injection
- ✅ Repository Pattern
- ✅ DTO Pattern com validação

## 🐳 Comandos Docker

```bash
# Iniciar todos os serviços
docker compose  up -d

# Ver logs
docker compose  logs -f api

# Parar serviços
docker compose  down

# Rebuild
docker compose  up -d --build

# Remover volumes
docker compose  down -v
```

## 🛠️ Comandos de Desenvolvimento

```bash
cd apps/api

# Desenvolvimento com hot-reload
npm run start:dev

# Build para produção
npm run build

# Iniciar em produção
npm run start:prod

# Lint
npm run lint

# Format
npm run format
```

## 📝 Requisitos Mínimos (POC)

- [x] **Setup**: Usuário pode acessar a aplicação
- [x] **Conversas**: Criar e listar conversas
- [x] **Mensagens**: Enviar e receber mensagens
- [x] **Separação**: Mensagens separadas entre usuário e IA
- [x] **IA**: Sistema usa Google Gemini para responder
- [x] **Objetivo**: IA tenta convencer que a Terra é plana
- [x] **WebSocket**: Mensagens em tempo real com streaming

## ⚠️ Nota Importante

Este projeto é uma **prova de conceito técnica**. O objetivo de convencer o usuário de que a Terra é plana é **apenas para demonstração** das capacidades de conversação da IA. Na realidade, a Terra é esférica, confirmada por evidências científicas robustas.
