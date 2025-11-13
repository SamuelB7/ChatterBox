# 🚀 ChatterBox 2.0 - Guia Rápido de Início

## ⚡ Início Rápido (5 minutos)

### 1. Configure sua chave API do Google Gemini

```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite e adicione sua chave
nano .env  # ou use seu editor preferido
```

**Obter chave**: https://makersuite.google.com/app/apikey

### 2. Rode toda a aplicação com Docker

```bash
docker-compose up --build
```

### 3. Acesse a aplicação

Aguarde ~80 segundos para os serviços iniciarem, então acesse:

🌐 **Frontend**: http://localhost:5173

---

## 📱 Como Usar

1. **Criar Nova Conversa**
   - Clique no botão "Nova Conversa"
   - Você será redirecionado para o chat

2. **Enviar Mensagem**
   - Digite sua mensagem no campo de texto
   - Pressione `Enter` para enviar
   - Use `Shift + Enter` para quebra de linha

3. **Ver Resposta da IA**
   - Aparecerá "IA está digitando..."
   - A resposta da IA chegará em tempo real (streaming)
   - A IA tentará convencer você que a Terra é plana! 🌍

4. **Navegar Entre Conversas**
   - Clique em outras conversas no sidebar
   - Cada conversa mantém seu histórico

---

## 🔗 Links Úteis

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api
- **API Docs (Swagger)**: http://localhost:3000/api/docs
- **Health Check**: http://localhost:3000/health

---

## 📊 Ver Logs

```bash
# Logs de todos os serviços
docker-compose logs -f

# Logs apenas do backend
docker-compose logs -f api

# Logs apenas do frontend
docker-compose logs -f web
```

---

## 🛑 Parar a Aplicação

```bash
# Parar serviços (mantém dados)
docker-compose down

# Parar e limpar tudo (apaga dados)
docker-compose down -v
```

---

## 📖 Documentação Completa

- **[DOCKER_SETUP.md](./DOCKER_SETUP.md)** - Guia completo de Docker
- **[README.md](./README.md)** - Documentação principal
- **[PROJECT_STATUS.md](./PROJECT_STATUS.md)** - Status do projeto

---

## 🐛 Problemas?

### Porta já está em uso

```bash
# Ver o que está usando a porta
sudo netstat -tulpn | grep -E '5173|3000|27017'

# Matar processo (ou mude a porta no docker-compose.yml)
sudo kill -9 <PID>
```

### Serviço não inicia

```bash
# Ver logs de erro
docker-compose logs <serviço>

# Exemplo
docker-compose logs api
```

### Limpar tudo e recomeçar

```bash
# Para todos os containers
docker-compose down -v

# Limpa cache do Docker
docker system prune -a

# Rebuild tudo do zero
docker-compose up --build
```

---

## ✅ Checklist Rápido

Antes de começar, verifique se você tem:

- [ ] Docker instalado (`docker --version`)
- [ ] Docker Compose instalado (`docker-compose --version`)
- [ ] Chave API do Google Gemini configurada no `.env`
- [ ] Portas 5173, 3000 e 27017 disponíveis

---

**Pronto!** 🎉

Agora você pode começar a usar o ChatterBox 2.0 e ter conversas interessantes com uma IA que acredita (ou finge acreditar) que a Terra é plana!
