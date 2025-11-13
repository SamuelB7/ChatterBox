# ChatterBox 2.0 - Backend API

Backend da aplicação ChatterBox 2.0, construído com NestJS, MongoDB e Google Gemini AI.

## 🚀 Tecnologias

- **NestJS** 10.x - Framework backend
- **MongoDB** 7.x - Banco de dados
- **Mongoose** 8.x - ODM
- **Google Gemini AI** - Integração de IA
- **Socket.io** 4.x - WebSocket para tempo real
- **TypeScript** 5.x
- **Jest** - Testes unitários
- **Swagger** - Documentação da API

## 📋 Pré-requisitos

- Node.js 20.x ou superior
- MongoDB 7.x rodando (localmente ou via Docker)
- Chave de API do Google Gemini

## 🔧 Instalação

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env e adicionar sua GEMINI_API_KEY
```

## 🏃 Executando a aplicação

```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod

# Debug
npm run start:debug
```

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes com watch mode
npm run test:watch

# Cobertura de testes
npm run test:cov
```

## 📚 Documentação da API

Após iniciar a aplicação, acesse:

- **API**: http://localhost:3000/api
- **Swagger UI**: http://localhost:3000/api/docs
- **Health Check**: http://localhost:3000/api/health

## 🏗️ Estrutura do Projeto

```
src/
├── main.ts                 # Entry point
├── app.module.ts           # Módulo raiz
├── app.controller.ts       # Controller principal
├── app.service.ts          # Service principal
├── common/                 # Código compartilhado
├── config/                 # Configurações
├── conversations/          # Módulo de conversas
├── messages/               # Módulo de mensagens
├── ai/                     # Serviço de IA (Gemini)
└── chat/                   # WebSocket Gateway
```

## 🐳 Docker

```bash
# Build da imagem
docker build -t chatterbox-api .

# Executar container
docker run -p 3000:3000 --env-file .env chatterbox-api
```

## 📝 Variáveis de Ambiente

Ver `.env.example` para todas as variáveis disponíveis.

Variáveis principais:
- `MONGODB_URI` - URI de conexão do MongoDB
- `GEMINI_API_KEY` - Chave de API do Google Gemini
- `PORT` - Porta da aplicação (padrão: 3000)
- `CORS_ORIGIN` - Origem permitida para CORS

## 📄 Licença

ISC
