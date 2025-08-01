# Dockerfile para EasyPanel
FROM node:20-alpine

# Instalar dependências do sistema
RUN apk add --no-cache python3 make g++

# Criar diretório da aplicação
WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependências
RUN npm ci --production

# Copiar código fonte
COPY . .

# Criar diretório para uploads
RUN mkdir -p uploads

# Build da aplicação
RUN npm run build

# Expor porta
EXPOSE 5000

# Variáveis de ambiente
ENV NODE_ENV=production

# Comando de inicialização
CMD ["npm", "start"]