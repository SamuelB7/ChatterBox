# 🐳 ChatterBox 2.0 - Docker Setup

## 📋 Visão Geral

Este documento explica como rodar toda a aplicação ChatterBox 2.0 (frontend, backend e banco de dados) usando Docker com um único comando.

---

## 🏗️ Arquitetura Docker

```
┌─────────────────────────────────────────────────────────────┐
│                     Docker Compose                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌────────────┐     ┌────────────┐     ┌────────────┐    │
│  │  Frontend  │────▶│  Backend   │────▶│  MongoDB   │    │
│  │  (Nginx)   │     │  (NestJS)  │     │  Database  │    │
│  │  Port 5173 │     │  Port 3000 │     │  Port 27017│    │
│  └────────────┘     └────────────┘     └────────────┘    │
│       ▲                    ▲                   ▲          │
│       │                    │                   │          │
│       └────── HTTP ────────┘                   │          │
│       └────── WebSocket ───────────────────────┘          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Como Rodar

### 1. Pré-requisitos

- Docker instalado (v20+)
- Docker Compose instalado (v2+)
- Google Gemini API Key

### 2. Configurar Variáveis de Ambiente

```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar o arquivo .env e adicionar sua chave API
nano .env
```

Adicione sua chave API do Google Gemini:
```env
GEMINI_API_KEY=sua_chave_aqui
```

**Como obter a chave**:
1. Acesse: https://makersuite.google.com/app/apikey
2. Faça login com sua conta Google
3. Clique em "Create API Key"
4. Copie a chave gerada

### 3. Rodar a Aplicação

```bash
# Construir e iniciar todos os serviços
docker-compose up --build

# Ou em modo detached (background)
docker-compose up -d --build
```

### 4. Acessar a Aplicação

Aguarde alguns segundos para os serviços iniciarem, então acesse:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **API Health**: http://localhost:3000/health
- **MongoDB**: mongodb://admin:admin123@localhost:27017/chatterbox

---

## 📦 Serviços Docker

### 1. MongoDB (mongo:7)
- **Container**: `chatterbox-mongodb`
- **Porta**: 27017
- **Credenciais**:
  - Username: `admin`
  - Password: `admin123`
  - Database: `chatterbox`
- **Volumes**:
  - `mongodb_data` - Dados persistentes
  - `mongodb_config` - Configurações
- **Health Check**: Ping test a cada 10s

### 2. Backend API (NestJS)
- **Container**: `chatterbox-api`
- **Porta**: 3000
- **Build**: Multi-stage (builder + production)
- **Variáveis**:
  - `NODE_ENV=production`
  - `MONGODB_URI` - Connection string com auth
  - `GEMINI_API_KEY` - Chave do Google AI
  - `CORS_ORIGIN` - Origens permitidas
- **Health Check**: HTTP GET /health a cada 30s
- **Depends On**: mongodb (healthy)

### 3. Frontend Web (React + Vite)
- **Container**: `chatterbox-web`
- **Porta**: 5173 (mapeada para 80 interno)
- **Build**: Multi-stage (build + nginx)
- **Servidor**: Nginx Alpine
- **Features**:
  - SPA routing configurado
  - Gzip compression
  - Cache de assets estáticos
  - Security headers
- **Health Check**: HTTP GET / a cada 30s
- **Depends On**: api (healthy)

---

## 🔧 Comandos Úteis

### Visualizar Logs
```bash
# Todos os serviços
docker-compose logs -f

# Serviço específico
docker-compose logs -f web
docker-compose logs -f api
docker-compose logs -f mongodb
```

### Parar a Aplicação
```bash
# Parar serviços (mantém volumes)
docker-compose stop

# Parar e remover containers (mantém volumes)
docker-compose down

# Parar, remover containers E volumes (limpa tudo)
docker-compose down -v
```

### Reconstruir Serviços
```bash
# Reconstruir tudo
docker-compose up --build

# Reconstruir apenas um serviço
docker-compose up --build web
docker-compose up --build api
```

### Ver Status dos Serviços
```bash
docker-compose ps
```

### Acessar Shell do Container
```bash
# Backend
docker exec -it chatterbox-api sh

# Frontend
docker exec -it chatterbox-web sh

# MongoDB
docker exec -it chatterbox-mongodb mongosh -u admin -p admin123
```

---

## 📊 Health Checks

Todos os serviços possuem health checks configurados:

### MongoDB
- **Teste**: `mongosh ping`
- **Intervalo**: 10s
- **Timeout**: 5s
- **Start Period**: 30s

### Backend API
- **Teste**: `wget http://localhost:3000/health`
- **Intervalo**: 30s
- **Timeout**: 3s
- **Start Period**: 40s

### Frontend Web
- **Teste**: `wget http://localhost:80`
- **Intervalo**: 30s
- **Timeout**: 3s
- **Start Period**: 10s

Ver status de health:
```bash
docker inspect --format='{{.State.Health.Status}}' chatterbox-api
docker inspect --format='{{.State.Health.Status}}' chatterbox-web
docker inspect --format='{{.State.Health.Status}}' chatterbox-mongodb
```

---

## 🔒 Segurança

### MongoDB
- Autenticação habilitada
- Credenciais via environment variables
- Network isolada (chatterbox-network)

### Backend
- Variáveis sensíveis via .env
- CORS configurado
- Health endpoint público

### Frontend
- Security headers configurados (Nginx)
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection

---

## 🐛 Troubleshooting

### Problema: Serviços não iniciam
```bash
# Ver logs de erro
docker-compose logs

# Verificar se portas estão ocupadas
netstat -tulpn | grep -E '5173|3000|27017'

# Limpar containers antigos
docker-compose down -v
docker system prune -a
```

### Problema: Frontend não conecta ao Backend
- Verificar se CORS está configurado corretamente
- Verificar se backend está healthy: `docker-compose ps`
- Ver logs do backend: `docker-compose logs api`

### Problema: MongoDB não conecta
- Verificar credenciais no docker-compose.yml
- Verificar se volume está corrompido: `docker volume ls`
- Recriar volume: `docker-compose down -v && docker-compose up`

### Problema: Build falha
```bash
# Limpar cache do Docker
docker builder prune

# Rebuild sem cache
docker-compose build --no-cache
```

---

## 📈 Performance

### Volumes Persistentes
- MongoDB usa volumes para persistir dados
- Dados sobrevivem a restarts
- Para limpar: `docker-compose down -v`

### Multi-stage Builds
- Backend: node:20-alpine (builder + production)
- Frontend: node:20-alpine + nginx:alpine
- Imagens otimizadas para produção

### Network Isolada
- Serviços se comunicam via rede Docker interna
- Apenas portas necessárias expostas ao host

---

## 📦 Estrutura de Arquivos Docker

```
ChatterBox/
├── docker-compose.yml          # Orquestração de todos os serviços
├── .env                        # Variáveis de ambiente (não versionado)
├── .env.example                # Exemplo de variáveis
│
├── apps/api/
│   ├── Dockerfile              # Multi-stage build do backend
│   └── .dockerignore           # Arquivos ignorados no build
│
└── apps/web/
    ├── Dockerfile              # Multi-stage build do frontend
    ├── nginx.conf              # Configuração do Nginx
    └── .dockerignore           # Arquivos ignorados no build
```

---

## 🎯 Próximos Passos

Após rodar com Docker:

1. ✅ Acesse http://localhost:5173
2. ✅ Clique em "Nova Conversa"
3. ✅ Envie uma mensagem
4. ✅ Veja a IA responder em tempo real

---

## 📚 Referências

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [MongoDB Docker Image](https://hub.docker.com/_/mongo)
- [Nginx Docker Image](https://hub.docker.com/_/nginx)
- [Node Docker Image](https://hub.docker.com/_/node)

---

**Versão**: 1.0
**Data**: 2025-11-13
**Status**: ✅ Testado e Funcional
