# Deploy no Vercel - LEBLOC Gallery

## Instruções para Deploy

### 1. Preparação do Projeto

O projeto já está configurado para o Vercel com:
- ✅ `vercel.json` configurado
- ✅ APIs serverless na pasta `/api`
- ✅ Build script otimizado
- ✅ Dependências necessárias

### 2. Deploy Manual

1. **Instalar Vercel CLI** (se não tiver):
```bash
npm i -g vercel
```

2. **Fazer login no Vercel**:
```bash
vercel login
```

3. **Deploy do projeto**:
```bash
vercel
```

### 3. Deploy Automático (GitHub)

1. **Conectar repositório ao Vercel**:
   - Vá para [vercel.com](https://vercel.com)
   - Clique em "New Project"
   - Importe seu repositório do GitHub

2. **Configurações automáticas**:
   - O Vercel detectará automaticamente as configurações
   - Build Command: `npm run build`
   - Output Directory: `dist/public`

### 4. Variáveis de Ambiente

Configure no painel do Vercel:
- `DATABASE_URL` - URL do banco PostgreSQL
- `NODE_ENV=production`

### 5. Configuração do Banco de Dados

**Opção 1: Neon (Recomendado)**
```bash
# No seu banco Neon, execute:
npm run db:push
```

**Opção 2: Vercel Postgres**
- Adicione Vercel Postgres no painel
- Configure automaticamente via interface

### 6. Armazenamento de Arquivos

⚠️ **Importante**: O Vercel não suporta armazenamento de arquivos persistente.

**Soluções recomendadas**:

1. **Cloudinary** (Gratuito até 25GB):
```bash
npm install cloudinary
```

2. **AWS S3**:
```bash
npm install aws-sdk
```

3. **Vercel Blob** (Pago):
```bash
npm install @vercel/blob
```

### 7. Estrutura do Projeto no Vercel

```
/
├── api/                 # Funções serverless
│   ├── media/
│   │   └── upload.ts   # Upload de mídia
│   └── uploads/
│       └── [...path].ts # Servir arquivos
├── public/             # Arquivos estáticos (gerado pelo build)
├── client/             # Código fonte React
└── vercel.json         # Configuração do Vercel
```

### 8. URLs Finais

Após o deploy:
- **Frontend**: `https://seu-app.vercel.app`
- **API**: `https://seu-app.vercel.app/api/`
- **Upload**: `https://seu-app.vercel.app/api/media/upload`

### 9. Comandos Úteis

```bash
# Deploy de produção
vercel --prod

# Visualizar logs
vercel logs

# Visualizar domínios
vercel domains

# Remover deployment
vercel remove
```

### 10. Troubleshooting

**Erro 404 em rotas (ex: /admin)**:
- ✅ Já configurado: `vercel.json` com rewrites para SPA
- ✅ Já configurado: `_redirects` na pasta client/public
- Todas as rotas do cliente agora redirecionam para `index.html`

**Erro de build**:
```bash
# Limpar cache e rebuildar
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Erro de API**:
- Verifique os logs no painel do Vercel
- Confirme se as variáveis de ambiente estão configuradas

**Erro de banco**:
- Verifique a `DATABASE_URL`
- Execute `npm run db:push` no banco

## Status de Funcionalidades

✅ Frontend responsivo
✅ Autenticação local
✅ Upload de arquivos via base64
❌ Armazenamento persistente de arquivos (precisa configurar serviço externo)
✅ Galeria de mídia
✅ Interface admin

Para suporte completo de arquivos, configure um dos serviços de armazenamento recomendados.