# Guia de Deploy na Vercel - LEBLOC Gallery

## Problemas Identificados

### ❌ Armazenamento de Arquivos
- **Problema**: Vercel é serverless - não suporta armazenamento local persistente
- **Solução**: Precisa usar serviço externo de storage

### ❌ Estrutura API
- **Problema**: Express server em `/server` não é compatível
- **Solução**: Migrar para funções individuais em `/api`

### ❌ Database Pooling
- **Problema**: Connection pools podem não funcionar bem em serverless
- **Solução**: Usar connections serverless

## Opções de Solução

### Opção 1: Migrar Storage para Serviço Externo ⭐ RECOMENDADA

#### A. Vercel Blob Storage
```bash
npm install @vercel/blob
```

**Vantagens:**
- Integração nativa com Vercel
- Fácil configuração
- Custo razoável

#### B. Cloudinary (Mais Popular)
```bash
npm install cloudinary
```

**Vantagens:**
- Otimização automática de imagens
- CDN global
- Plano gratuito generoso

#### C. AWS S3
```bash
npm install @aws-sdk/client-s3
```

**Vantagens:**
- Mais controle
- Muito barato
- Escalável

### Opção 2: Deploy no Replit (Mais Simples) ⭐ RECOMENDADA

**Vantagens:**
- Zero mudanças no código
- Funciona imediatamente
- Suporte nativo a file storage
- Database já configurado

**Como fazer:**
1. Clique em "Deploy" no Replit
2. Configure domínio personalizado se quiser
3. Done! 🎉

## Mudanças Necessárias para Vercel

### 1. Migrar Storage de Arquivos

#### Exemplo com Vercel Blob:
```typescript
// api/photos/upload.ts
import { put } from '@vercel/blob';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  
  // Upload para Vercel Blob
  const blob = await put(file.name, file, {
    access: 'public',
  });
  
  // Salvar URL no database
  const photo = await storage.createPhoto({
    title: formData.get('title'),
    imageUrl: blob.url, // URL do Vercel Blob
    categoryId: parseInt(formData.get('categoryId')),
    uploadedBy: parseInt(formData.get('userId'))
  });
  
  return Response.json(photo);
}
```

### 2. Reestruturar APIs

Mover de `/server/routes.ts` para funções individuais:
```
api/
├── categories/
│   ├── route.ts          # GET, POST /api/categories
│   └── [id]/route.ts     # PUT, DELETE /api/categories/[id]
├── photos/
│   ├── route.ts          # GET /api/photos
│   ├── upload.ts         # POST /api/photos/upload
│   └── [id]/route.ts     # PUT, DELETE /api/photos/[id]
└── users/
    ├── route.ts          # GET, POST /api/users
    └── [id]/route.ts     # PUT, DELETE /api/users/[id]
```

### 3. Configurar Database para Serverless

```typescript
// lib/db.ts
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql);
```

## Variáveis de Ambiente na Vercel

```bash
# Database
DATABASE_URL=sua_url_do_postgresql

# Storage (escolha uma opção)
# Vercel Blob
BLOB_READ_WRITE_TOKEN=seu_token

# Cloudinary
CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=seu_api_secret

# AWS S3
AWS_ACCESS_KEY_ID=sua_key
AWS_SECRET_ACCESS_KEY=seu_secret
AWS_REGION=us-east-1
AWS_BUCKET_NAME=seu_bucket
```

## Estimativa de Trabalho

### Deploy no Replit: 
- **Tempo**: 5 minutos
- **Complexidade**: Muito baixa
- **Mudanças**: Zero

### Migração para Vercel:
- **Tempo**: 4-6 horas
- **Complexidade**: Alta
- **Mudanças**: Reestruturação significativa

## Recomendação Final

**Para uso imediato**: Use Replit Deploy
**Para produção profissional**: Migre para Vercel + Cloudinary

Qual opção você prefere seguir?