# Deploy LEBLOC Gallery no EasyPanel

## Por que EasyPanel é Perfeito para Esta App ⭐

### Vantagens do EasyPanel:
- **✅ File Storage Nativo**: Suporta uploads de arquivos com volumes persistentes
- **✅ PostgreSQL Integrado**: Database gerenciado automaticamente
- **✅ Zero Mudanças**: Sua aplicação funciona exatamente como está
- **✅ Docker Native**: Deploy via containers
- **✅ SSL Automático**: HTTPS configurado automaticamente
- **✅ Logs e Monitoring**: Interface completa de gerenciamento

## Comparação com Outras Plataformas:

| Feature | EasyPanel | Vercel | Replit |
|---------|-----------|---------|---------|
| File Storage | ✅ Volumes | ❌ Precisa storage externo | ✅ Nativo |
| Database | ✅ PostgreSQL | ⚠️ Precisa configurar | ✅ Nativo |
| Mudanças no código | ✅ Zero | ❌ Reestruturação completa | ✅ Zero |
| Custo | 💰 Baixo | 💰💰 Médio | 💰💰💰 Alto |
| Escalabilidade | ✅ Alta | ✅ Muito Alta | ⚠️ Limitada |

## Arquivos de Deploy Criados:

### 1. `Dockerfile` 
- Configuração Docker otimizada para Node.js
- Build automático da aplicação
- Suporte a uploads persistentes

### 2. `docker-compose.yml`
- Para testes locais
- PostgreSQL + App completos
- Volumes persistentes

## Passos para Deploy no EasyPanel:

### 1. **Preparar Repositório**
```bash
# Adicionar arquivos de deploy ao git
git add Dockerfile docker-compose.yml
git commit -m "Add EasyPanel deployment config"
git push
```

### 2. **Configurar no EasyPanel**
1. Login no seu painel EasyPanel
2. Criar novo projeto
3. Conectar ao seu repositório Git
4. EasyPanel detecta automaticamente o Dockerfile

### 3. **Configurar Variáveis de Ambiente**
```bash
NODE_ENV=production
DATABASE_URL=postgresql://[gerado_automaticamente]
```

### 4. **Configurar Volumes**
- Volume para `/app/uploads` (arquivos de fotos)
- Volume para PostgreSQL (dados do banco)

### 5. **Deploy Automático**
- EasyPanel faz build e deploy automático
- SSL configurado automaticamente
- Domain personalizado disponível

## Configurações Recomendadas:

### Resources:
- **CPU**: 0.5-1 vCPU
- **RAM**: 512MB-1GB  
- **Storage**: 5-10GB para uploads

### Health Check:
- **Endpoint**: `/api/categories`
- **Timeout**: 30s
- **Interval**: 60s

### Backup:
- Database: Backup automático diário
- Uploads: Backup semanal do volume

## Custos Estimados:

### EasyPanel Básico:
- **Servidor**: $5-15/mês
- **Database**: Incluído
- **SSL**: Incluído
- **Backup**: $2-5/mês

**Total**: ~$7-20/mês (muito econômico!)

## Vantagens vs Vercel:

| Aspecto | EasyPanel | Vercel |
|---------|-----------|---------|
| Setup | 10 minutos | 4-6 horas |
| Mudanças no código | Zero | Reestruturação completa |
| File storage | Nativo | Precisa storage externo ($) |
| Database | Incluído | Precisa configurar ($) |
| Custo mensal | $7-20 | $20-50+ |

## Próximos Passos:

1. **Testar Localmente** (opcional):
   ```bash
   docker-compose up
   ```

2. **Push para Git**:
   ```bash
   git add .
   git commit -m "Add EasyPanel deployment"
   git push
   ```

3. **Deploy no EasyPanel**:
   - Conectar repositório
   - Configurar variáveis
   - Deploy automático

4. **Configurar Domain**:
   - Domain personalizado
   - SSL automático

## Resultado Final:
- ✅ App funcionando 100% como no Replit
- ✅ Uploads de fotos funcionando
- ✅ Database PostgreSQL
- ✅ SSL e domain personalizado
- ✅ Custo baixo e escalável

**EasyPanel é a escolha ideal para sua aplicação!** 🎯