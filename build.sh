#!/bin/bash

# Script de build para Vercel
echo "Building LEBLOC Gallery for Vercel deployment..."

# Build do frontend
echo "Building frontend..."
npm run build

# Criar estrutura de diretórios para o Vercel
echo "Setting up Vercel structure..."
mkdir -p public

# Copiar arquivos buildados para o diretório public
if [ -d "dist/public" ]; then
  cp -r dist/public/* public/
fi

# Criar arquivo de configuração do Vercel se não existir
if [ ! -f "vercel.json" ]; then
  echo "Creating vercel.json..."
  cat > vercel.json << 'EOF'
{
  "version": 2,
  "builds": [
    {
      "src": "client/**/*",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "public"
      }
    },
    {
      "src": "api/**/*.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/uploads/(.*)",
      "dest": "/api/uploads/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/public/$1"
    }
  ]
}
EOF
fi

echo "Build completed! Ready for Vercel deployment."