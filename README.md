# ChatterBox 2.0

Sistema de conversação com IA desenvolvido com NestJS, MongoDB e Google Gemini AI. Esta é uma prova de conceito (POC) onde a IA tem o objetivo de convencer o usuário de que a Terra é plana.

## 🏗️ Estrutura do Projeto (Monorepo)

```
ChatterBox/
├── apps/
│   ├── api/                    # Backend (NestJS + MongoDB)
│   └── web/                    # Frontend (React + Vite) - A ser implementado
├── docs/                       # Documentação
│   ├── DTOS_CONTRACTS.md       # Contratos de API e DTOs
│   ├── IMPLEMENTATION_PLAN_BACKEND.md
│   └── IMPLEMENTATION_PLAN_FRONTEND.md
├── docker-compose.yml          # Orquestração de containers
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

### Frontend (A implementar)
- **React** 18.x
- **Vite** 5.x
- **TailwindCSS** 3.x
- **Socket.io Client** 4.x

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
```

### 3. Instalar dependências do backend

```bash
cd apps/api
npm install
```

## 🏃 Executando a aplicação

### Opção 1: Com Docker (Recomendado)

```bash
# Na raiz do projeto
docker-compose up -d
```

Serviços disponíveis:
- **API**: http://localhost:3000/api
- **Swagger Docs**: http://localhost:3000/api/docs
- **MongoDB**: localhost:27017

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

- **[DTOS_CONTRACTS.md](./DTOS_CONTRACTS.md)** - Contratos de API, DTOs e eventos WebSocket
- **[IMPLEMENTATION_PLAN_BACKEND.md](./IMPLEMENTATION_PLAN_BACKEND.md)** - Plano detalhado do backend
- **[IMPLEMENTATION_PLAN_FRONTEND.md](./IMPLEMENTATION_PLAN_FRONTEND.md)** - Plano detalhado do frontend

## 🎯 Status da Implementação

### ✅ Fase 1 - Setup Inicial Backend (COMPLETO)
- [x] Estrutura de diretórios criada
- [x] NestJS configurado
- [x] TypeScript, ESLint e Prettier configurados
- [x] MongoDB integrado via Mongoose
- [x] Swagger configurado
- [x] Docker e docker-compose configurados
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

### 🔄 Próximas Fases
- [ ] Fase 4 - Integração Google Gemini AI
- [ ] Fase 5 - WebSocket Gateway
- [ ] Fase 6 - Testes Unitários
- [ ] Fase 7 - Frontend (React)

## 🐳 Comandos Docker

```bash
# Iniciar todos os serviços
docker-compose up -d

# Ver logs
docker-compose logs -f api

# Parar serviços
docker-compose down

# Rebuild
docker-compose up -d --build

# Remover volumes
docker-compose down -v
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
- [ ] **Conversas**: Criar e listar conversas
- [ ] **Mensagens**: Enviar e receber mensagens
- [ ] **Separação**: Mensagens separadas entre usuário e IA
- [ ] **IA**: Sistema usa Google Gemini para responder
- [ ] **Objetivo**: IA tenta convencer que a Terra é plana
- [ ] **WebSocket** (Opcional): Mensagens em tempo real com streaming

## ⚠️ Nota Importante

Este projeto é uma **prova de conceito técnica**. O objetivo de convencer o usuário de que a Terra é plana é **apenas para demonstração** das capacidades de conversação da IA. Na realidade, a Terra é esférica, confirmada por evidências científicas robustas.

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

ISC

## 👥 Autor

Desenvolvido como parte do desafio técnico ChatterBox 2.0.
