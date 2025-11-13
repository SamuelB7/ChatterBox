#!/bin/bash

echo "🔍 Verificando setup do ChatterBox API..."
echo ""

# Verificar Node.js
echo "✓ Verificando Node.js..."
node --version || { echo "❌ Node.js não encontrado"; exit 1; }

# Verificar npm
echo "✓ Verificando npm..."
npm --version || { echo "❌ npm não encontrado"; exit 1; }

# Verificar node_modules
echo "✓ Verificando dependências..."
if [ ! -d "node_modules" ]; then
    echo "❌ node_modules não encontrado. Execute: npm install"
    exit 1
fi

# Verificar arquivos essenciais
echo "✓ Verificando arquivos de configuração..."
files=(
    "package.json"
    "tsconfig.json"
    ".eslintrc.js"
    ".prettierrc"
    "nest-cli.json"
    "src/main.ts"
    "src/app.module.ts"
    ".env"
)

for file in "${files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Arquivo não encontrado: $file"
        exit 1
    fi
done

# Verificar build
echo "✓ Testando build..."
npm run build > /dev/null 2>&1 || { echo "❌ Build falhou"; exit 1; }

# Verificar lint
echo "✓ Testando lint..."
npm run lint > /dev/null 2>&1 || { echo "❌ Lint falhou"; exit 1; }

echo ""
echo "✅ Setup verificado com sucesso!"
echo ""
echo "📝 Próximos passos:"
echo "  1. Configure sua GEMINI_API_KEY no arquivo .env"
echo "  2. Inicie o MongoDB: docker run -d -p 27017:27017 mongo:7"
echo "  3. Inicie a API: npm run start:dev"
echo "  4. Acesse: http://localhost:3000/api/docs"
echo ""
