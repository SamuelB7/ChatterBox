# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ChatterBox 2.0 is an AI-powered conversation system built as a monorepo with NestJS backend and React frontend. The application uses Google Gemini AI to generate responses in real-time via WebSocket streaming. This is a proof of concept where the AI attempts to convince users that Earth is flat (for demonstration purposes only).

## Development Commands

### Docker (Recommended)

```bash
# Start all services (MongoDB + API + Web)
docker compose up --build

# Start in background
docker compose up -d --build

# View logs
docker compose logs -f
docker compose logs -f api

# Stop services
docker compose down

# Clean everything including volumes
docker compose down -v
```

**Services when running:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api
- Swagger Docs: http://localhost:3000/api/docs
- Health Check: http://localhost:3000/api/health
- MongoDB: localhost:27017 (admin/admin123)

### Backend Development (apps/api)

```bash
cd apps/api

# Install dependencies
npm install

# Development with hot-reload
npm run start:dev

# Build
npm run build

# Production
npm run start:prod

# Linting and formatting
npm run lint
npm run format

# Testing
npm run test              # Run all tests
npm run test:watch        # Watch mode
npm run test:cov          # With coverage
```

### Frontend Development (apps/web)

```bash
cd apps/web

# Install dependencies
npm install

# Development server
npm run dev

# Build
npm run build

# Preview production build
npm run preview

# Linting
npm run lint
```

### Local Development (without Docker)

1. Start MongoDB: `docker run -d -p 27017:27017 --name mongodb mongo:7`
2. Start backend: `cd apps/api && npm run start:dev`
3. Start frontend: `cd apps/web && npm run dev`

## Architecture

### Monorepo Structure

```
apps/
├── api/          # NestJS backend with MongoDB
└── web/          # React + Vite frontend
docs/             # Technical documentation
```

### Backend Architecture (NestJS)

The backend follows a modular architecture with 4 main feature modules:

**ConversationsModule** (`apps/api/src/conversations/`)
- Manages conversation entities and CRUD operations
- Repository pattern with `ConversationRepository`
- REST endpoints: create, list, get, update, archive, delete, stats
- MongoDB schema: `conversation.schema.ts`

**MessagesModule** (`apps/api/src/messages/`)
- Handles message persistence and retrieval
- Repository pattern with `MessageRepository`
- REST endpoints: send, list, get last, delete
- Automatically increments `messageCount` on conversations
- MongoDB schema: `message.schema.ts`

**AIModule** (`apps/api/src/ai/`)
- Google Gemini AI integration using `@google/genai` SDK
- Two generation modes:
  - `generateResponse()`: Complete response (for REST)
  - `generateResponseStream()`: Async generator for real-time streaming (for WebSocket)
- System prompt in `prompts/flat-earth.prompt.ts`
- Configured via `GEMINI_API_KEY` and `GEMINI_MODEL` env vars

**ChatModule** (`apps/api/src/chat/`)
- WebSocket gateway using Socket.io (namespace: `/chat`)
- Orchestrates Messages + AI modules via `ChatService`
- Events:
  - Client: `join:conversation`, `send:message`, `leave:conversation`
  - Server: `joined:conversation`, `message:saved`, `ai:typing`, `ai:response:stream`, `ai:response:complete`, `left:conversation`, `error`
- Implements real-time streaming of AI responses

**Key Patterns:**
- Repository pattern for data access (separate repositories for Conversations and Messages)
- DTOs with `class-validator` for all inputs/outputs
- Dependency injection throughout
- Global validation pipe with strict whitelist
- Swagger documentation on all REST endpoints

**Entry Point:** `apps/api/src/main.ts` configures CORS, validation, Swagger, and global API prefix

### Frontend Architecture (React)

**Routing** (`apps/web/src/App.tsx`)
- React Router v7
- Routes: `/` (HomePage), `/conversation/:id` (ConversationPage), `*` (NotFoundPage)

**API Layer** (`apps/web/src/services/api/`)
- Axios client with interceptors
- Services: `conversationsApi`, `messagesApi`
- Base URL configured via `VITE_API_BASE_URL`

**WebSocket Layer** (`apps/web/src/services/websocket/`)
- Socket.io client configured via `VITE_WS_URL`
- `SocketService`: Connection manager with auto-reconnect
- `ChatSocket`: Event wrapper for type-safe WebSocket communication

**Components** (`apps/web/src/components/`)
- `ui/`: Basic UI components (Button, Input, Card, LoadingSpinner)
- `chat/`: Chat-specific (ChatHeader, MessageList, MessageBubble, MessageInput, TypingIndicator)
- `conversations/`: Conversation management (ConversationList, ConversationItem, NewConversationModal)
- `layout/`: Page structure (Layout, Header, ErrorBoundary)

**Styling:** TailwindCSS v3 with custom animations

### Data Flow

1. **User sends message:**
   - Frontend → WebSocket `send:message` event
   - ChatGateway → ChatService.processMessageStream()
   - Saves user message → Emits `message:saved`
   - AIService.generateResponseStream() starts

2. **AI response streaming:**
   - Each chunk → Emits `ai:response:stream`
   - Frontend displays chunks in real-time
   - Complete → Saves AI message → Emits `ai:response:complete`

3. **REST API:**
   - Used for CRUD operations on conversations
   - WebSocket used exclusively for message exchange

### Environment Configuration

**Root `.env`:**
- `GEMINI_API_KEY`: Google Gemini API key (required)

**Backend `.env` (`apps/api/.env`):**
- `NODE_ENV`, `PORT`, `API_PREFIX`
- `MONGODB_URI`, `MONGODB_DB_NAME`
- `GEMINI_API_KEY`, `GEMINI_MODEL` (e.g., `gemini-2.0-flash`)
- `CORS_ORIGIN`, `WS_CORS_ORIGIN` (comma-separated)

**Frontend `.env` (`apps/web/.env`):**
- `VITE_API_BASE_URL`: Backend REST API URL
- `VITE_WS_URL`: WebSocket URL (with `/chat` namespace)
- `VITE_APP_NAME`

**Note:** Both backend CORS variables support comma-separated origins for multiple allowed origins.

### Database Schema

**Conversations Collection:**
- `title`: string
- `messageCount`: number (auto-incremented)
- `lastMessageAt`: Date
- `isArchived`: boolean
- `createdAt`, `updatedAt`: timestamps

**Messages Collection:**
- `conversationId`: ObjectId ref
- `role`: 'user' | 'assistant'
- `content`: string
- `metadata`: { processingTime?, model? }
- `createdAt`: timestamp

### Testing

All core services have unit tests (50+ tests total):
- ConversationsService: 13 tests
- MessagesService: 15 tests
- AIService: 6 tests
- ChatService: 16 tests

Run with: `cd apps/api && npm test`

### Important Notes

- The AI uses a custom "Flat Earth" system prompt as a POC demonstration only
- WebSocket uses `/chat` namespace - ensure clients connect to `http://localhost:3000/chat`
- CORS origins must be explicitly configured in environment variables
- The application requires a valid `GEMINI_API_KEY` from Google Gemini
- MongoDB runs with authentication in Docker (admin/admin123)
