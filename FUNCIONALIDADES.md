# LEBLOC Gallery - Funcionalidades Detalhadas

## Visão Geral do Sistema

LEBLOC Gallery é uma aplicação completa para gerenciamento de galerias de mídia para eventos e serviços. O sistema permite upload, organização e exibição de fotos e vídeos com interface responsiva e sistema de autenticação robusto.

## Funcionalidades Principais

### 1. Galeria Pública
- **Acesso**: Disponível em `/` sem necessidade de login
- **Visualização**: Grid responsivo com layout automático
- **Filtros**: Categorias (Estrutura, Formatura, Casamento, Corporativo, Eventos Sociais)
- **Modal**: Visualização em tela cheia com navegação por setas
- **Responsividade**: Layout otimizado para mobile e desktop

### 2. Sistema de Autenticação
- **Login Seguro**: Validação de credenciais com feedback visual
- **Conta Admin Padrão**: 
  - Email: `admin@lebloc.com`
  - Senha: `admin123`
- **Controle de Acesso**: Proteção de rotas administrativas
- **Persistência**: Sessão salva em localStorage
- **Logout**: Limpeza completa da sessão

### 3. Painel Administrativo
- **Acesso**: Disponível em `/admin` apenas para usuários autenticados
- **Interface Dupla**: Abas para Galeria e Usuários
- **Upload de Mídia**: Interface drag-and-drop com validação
- **Gerenciamento**: Visualizar e deletar conteúdo existente

### 4. Upload de Arquivos
- **Tipos Suportados**: 
  - Imagens: JPG, PNG, GIF (até 2MB)
  - Vídeos: MP4, WebM (até 20GB)
- **Validação**: Verificação automática de tipo e tamanho
- **Categorização**: Atribuição obrigatória de categoria
- **Armazenamento Duplo**: 
  - Servidor (diretório `/uploads`)
  - Cliente (localStorage como backup)

### 5. Gerenciamento de Usuários
- **Criação**: Novos usuários através do painel admin
- **Edição**: Modificação de dados existentes
- **Roles**: Administrador e usuário comum
- **Validação**: Email único e senhas seguras

## Interface do Usuário

### Design System
- **Framework**: shadcn/ui built on Radix UI
- **Estilização**: Tailwind CSS com variáveis CSS customizadas
- **Tema**: Suporte a modo claro/escuro
- **Acessibilidade**: Componentes acessíveis por padrão

### Componentes Principais
- **Header**: Navegação principal com estado de login
- **GallerySection**: Grid de mídia com filtros
- **MediaModal**: Visualizador em tela cheia
- **UploadModal**: Interface de upload
- **UserManagement**: Gerenciamento de usuários
- **Toast**: Notificações de feedback

## Tecnologias Utilizadas

### Frontend
- **React 18**: Framework principal com hooks
- **TypeScript**: Tipagem estática
- **Vite**: Build tool e dev server
- **Wouter**: Roteamento client-side
- **TanStack Query**: Gerenciamento de estado servidor
- **Tailwind CSS**: Framework de estilização

### Backend
- **Express.js**: Framework web
- **TypeScript**: Tipagem para Node.js
- **Multer**: Upload de arquivos
- **Drizzle ORM**: ORM type-safe para PostgreSQL
- **PostgreSQL**: Banco de dados

### Deploy
- **Replit**: Desenvolvimento e hosting
- **Vercel**: Deploy serverless configurado
- **Environment Variables**: Configuração por variáveis

## Fluxos de Uso

### 1. Visualização Pública
1. Usuário acessa `/`
2. Galeria carrega automaticamente
3. Filtros disponíveis por categoria
4. Click em item abre modal
5. Navegação por setas ou click

### 2. Upload de Mídia (Admin)
1. Login com credenciais admin
2. Acesso ao painel `/admin`
3. Click em "Upload" ou aba Galeria
4. Seleção de arquivo
5. Preenchimento de título e categoria
6. Validação automática
7. Upload e feedback

### 3. Gerenciamento de Usuários (Admin)
1. Acesso à aba "Usuários" no admin
2. Visualização de usuários existentes
3. Criação de novos usuários
4. Edição de dados existentes
5. Controle de permissões

## Segurança

### Autenticação
- Validação de credenciais no cliente
- Proteção de rotas administrativas
- Logout seguro com limpeza de sessão

### Validação de Arquivos
- Verificação de tipo MIME
- Limitação de tamanho por tipo
- Sanitização de nomes de arquivo

### Controle de Acesso
- Verificação de role para operações admin
- Proteção de endpoints sensíveis
- Validação de ownership para operações

## Performance

### Otimizações Frontend
- Lazy loading de componentes
- Otimização de imagens
- Caching com TanStack Query
- Bundle splitting com Vite

### Otimizações Backend
- Serving estático otimizado
- Compressão de assets
- Headers de cache apropriados

## Status de Desenvolvimento

### ✅ Implementado
- Autenticação completa
- Upload de arquivos
- Galeria responsiva
- Painel administrativo
- Sistema de usuários
- Deploy para Vercel configurado

### 🔄 Em Progresso
- Otimizações de performance
- Testes automatizados

### 📋 Próximas Funcionalidades
- Busca por texto
- Tags para mídia
- Compartilhamento social
- Backup automático
- Analytics de uso

## Suporte e Manutenção

### Logs e Debug
- Console logs estruturados
- Error boundaries no React
- Handling de erros no servidor

### Monitoramento
- Health checks automáticos
- Métricas de performance
- Tracking de erros

### Backup
- Dados em localStorage como fallback
- Exportação manual de dados
- Versionamento de arquivos