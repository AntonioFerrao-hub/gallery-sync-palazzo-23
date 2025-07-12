# Sistema de Galeria LEBLOC

## Visão Geral

Sistema completo de galeria de imagens e vídeos para Centro de Eventos Palazzo, desenvolvido com React + TypeScript. O sistema permite aos usuários fazer login, upload de mídias e gerenciar uma galeria organizada por categorias.

## Funcionalidades Implementadas

### ✅ Autenticação
- **Login/Registro**: Sistema completo de autenticação de usuários
- **Proteção de rotas**: Acesso à galeria apenas para usuários logados
- **Logout**: Saída segura do sistema

### ✅ Upload de Mídias
- **Suporte a imagens**: JPG, PNG, GIF (máximo 2MB)
- **Suporte a vídeos**: MP4, WebM (máximo 20GB)
- **Drag & Drop**: Interface intuitiva para upload
- **Validação de arquivos**: Verificação de tipo e tamanho
- **Thumbnails de vídeo**: Geração automática de miniaturas

### ✅ Galeria Responsiva
- **Grid responsivo**: Layout adaptável para todos os dispositivos
- **Categorias organizadas**: Estrutura, Formatura, Casamento, Corporativo, Eventos Sociais
- **Cards com overlay**: Efeitos visuais elegantes no hover
- **Visual idêntico ao HTML**: Mantém exatamente o design fornecido

### ✅ Visualização de Mídias
- **Modal responsivo**: Exibição em tela cheia
- **Navegação entre mídias**: Setas e teclado (← →)
- **Player de vídeo integrado**: Reprodução direta no modal
- **Informações detalhadas**: Título, categoria, data, autor

### ✅ Gerenciamento
- **Deleção de mídias**: Usuários podem deletar suas próprias mídias
- **Controle de permissões**: Apenas o autor pode deletar
- **Organização por categorias**: Sistema de classificação estruturado

## Tecnologias Utilizadas

### Frontend
- **React 18**: Framework base com Hooks
- **TypeScript**: Tipagem estática e maior robustez
- **Tailwind CSS**: Estilização responsiva e sistema de design
- **Lucide React**: Ícones modernos e consistentes
- **React Router**: Navegação entre páginas

### Persistência (Simulação de Backend)
- **LocalStorage**: Armazenamento local dos dados
- **Base64**: Codificação de arquivos para armazenamento
- **Simulação de API**: Funcionalidades completas de CRUD

## Estrutura do Projeto

```
src/
├── components/           # Componentes React
│   ├── Header.tsx       # Cabeçalho com navegação
│   ├── Login.tsx        # Página de login
│   ├── Register.tsx     # Página de registro
│   ├── UploadModal.tsx  # Modal de upload
│   ├── MediaModal.tsx   # Modal de visualização
│   ├── GallerySection.tsx # Seção da galeria
│   └── ProtectedRoute.tsx # Proteção de rotas
├── utils/               # Utilitários
│   ├── auth.ts          # Funções de autenticação
│   ├── media.ts         # Funções de mídia
│   └── sampleData.ts    # Dados de exemplo
├── types/               # Definições TypeScript
│   └── index.ts         # Interfaces e tipos
├── assets/              # Imagens geradas
└── pages/               # Páginas principais
    └── Index.tsx        # Página principal da galeria
```

## Como Usar

### 1. Primeiro Acesso
1. Acesse a aplicação
2. Clique em "Registre-se"
3. Preencha nome, email e senha
4. Faça login com suas credenciais

### 2. Navegação
- **Header fixo**: Navegação entre categorias
- **Scroll suave**: Clique nas categorias para navegar
- **Botão Upload**: Acesso rápido ao envio de mídias
- **Botão Sair**: Logout seguro

### 3. Upload de Mídias
1. Clique no botão "Upload" no header
2. Preencha o título da mídia
3. Selecione a categoria apropriada
4. Arraste o arquivo ou clique para selecionar
5. Confirme o upload

### 4. Visualização
- **Clique em qualquer mídia** para abrir o modal
- **Use as setas** ou teclas ← → para navegar
- **ESC** para fechar o modal
- **Botão deletar** aparece apenas para mídias próprias

## Validações Implementadas

### Autenticação
- Email único por usuário
- Senha mínima de 6 caracteres
- Confirmação de senha no registro
- Verificação de credenciais no login

### Upload
- **Tipos permitidos**: JPG, PNG, GIF, MP4, WebM
- **Tamanho máximo**: 2MB para imagens, 20GB para vídeos
- **Campos obrigatórios**: Título e categoria
- **Validação de arquivo**: Tipo e tamanho verificados

## Design System

O sistema mantém 100% do visual do HTML fornecido:

### Cores
- **Dourado primário**: `#D4AF37` para destaques
- **Fundo branco**: Layout limpo e moderno
- **Texto escuro**: `#1a1a1a` para legibilidade
- **Overlay gradiente**: Efeito elegante nos cards

### Componentes
- **Grid responsivo**: Auto-fit com mínimo de 280px
- **Cards com hover**: Escala 1.02 e sombra elevada
- **Modal centralizado**: Fundo blur e sombra elegante
- **Navegação suave**: Transições de 0.3s

### Tipografia
- **Font**: Inter (300-700 weights)
- **Hierarquia clara**: Títulos, subtítulos e texto
- **Legibilidade otimizada**: Contrast ratios adequados

## Dados de Exemplo

O sistema inclui dados de demonstração que são automaticamente carregados no primeiro acesso:

- **14 mídias de exemplo** distribuídas entre as 5 categorias
- **Imagens geradas por IA** para estrutura, casamentos e eventos corporativos
- **Imagens do Picsum** para demonstração adicional
- **Metadados realistas** com datas dos últimos 30 dias

## Extensibilidade

### Backend Real
Para implementar um backend real (Python + SQLite):

1. **API Endpoints necessários**:
   - `POST /auth/login` - Autenticação
   - `POST /auth/register` - Registro
   - `GET /media` - Listar mídias
   - `POST /media` - Upload
   - `DELETE /media/:id` - Deletar

2. **Banco de dados**:
   ```sql
   -- Tabela users
   CREATE TABLE users (
     id INTEGER PRIMARY KEY,
     name TEXT NOT NULL,
     email TEXT UNIQUE NOT NULL,
     password_hash TEXT NOT NULL,
     created_at DATETIME DEFAULT CURRENT_TIMESTAMP
   );

   -- Tabela media
   CREATE TABLE media (
     id INTEGER PRIMARY KEY,
     title TEXT NOT NULL,
     category TEXT NOT NULL,
     type TEXT NOT NULL,
     file_path TEXT NOT NULL,
     thumbnail_path TEXT,
     user_id INTEGER NOT NULL,
     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
     size INTEGER NOT NULL,
     filename TEXT NOT NULL,
     FOREIGN KEY (user_id) REFERENCES users (id)
   );
   ```

3. **Substituir LocalStorage** pelas chamadas de API

### Novas Funcionalidades
- **Sistema de comentários** em mídias
- **Compartilhamento público** de galerias
- **Filtros avançados** por data, tipo, autor
- **Favoritos** e coleções personalizadas
- **Edição de metadados** após upload

## Considerações de Produção

### Segurança
- Implementar hash bcrypt para senhas
- Validação server-side de uploads
- Sanitização de inputs
- Rate limiting para uploads
- HTTPS obrigatório

### Performance
- Lazy loading de imagens
- Compressão automática de uploads
- CDN para armazenamento de mídias
- Paginação para galerias grandes
- Cache de thumbnails

### Monitoramento
- Logs de erro detalhados
- Métricas de uso e performance
- Backup automático de dados
- Alertas de sistema

## Conclusão

O sistema LEBLOC Gallery oferece uma solução completa e elegante para gerenciamento de mídias de eventos, mantendo fidelidade total ao design original enquanto adiciona funcionalidades robustas de autenticação, upload e gerenciamento. A arquitetura modular permite fácil manutenção e extensão futuras.