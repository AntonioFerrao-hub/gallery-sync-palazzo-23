# LEBLOC Gallery Application

## Overview

LEBLOC Gallery is a full-stack web application for managing and displaying media galleries for events and services. The application features a React frontend with shadcn/ui components, an Express.js backend, and uses PostgreSQL with Drizzle ORM for data persistence. The system includes user authentication, media upload/management, and a gallery display with modal navigation.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

**2025-02-01**: Implementado sistema completo de galeria LEBLOC
- ✓ Configurado banco PostgreSQL com schema completo (users, categories, photos)
- ✓ Implementada autenticação administrativa com token básico
- ✓ Desenvolvida área administrativa completa com dashboard, categorias e fotos
- ✓ Criada galeria pública responsiva com filtros por categoria
- ✓ Adicionado sistema de upload com suporte base64 para Vercel
- ✓ Implementado modal de visualização com navegação entre fotos
- ✓ Configurado deployment para Replit e Vercel com funções serverless
- ✓ Criado usuário admin padrão (admin/admin123)

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript and Vite for development/build tooling
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system variables
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state, localStorage for client-side persistence
- **Build Tool**: Vite with custom configuration for development and production

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **File Handling**: Multer for media uploads with local file storage
- **Session Management**: In-memory storage with fallback authentication system
- **Development**: Hot reload with Vite middleware integration

## Key Components

### Authentication System
- Role-based access control (admin/user)
- Default admin account (admin@lebloc.com / admin123)
- localStorage-based session persistence
- Protected routes with redirect logic

### Media Management
- File upload support for images (JPG, PNG, GIF) and videos (MP4, WebM)
- Size limits: 2MB for images, 20GB for videos
- Local file storage in uploads directory
- Base64 conversion for client-side storage fallback
- Media categorization by event types

### Gallery Display
- Responsive grid layout with category filtering
- Modal viewer with navigation controls
- Thumbnail generation for videos
- Full-screen media display

### User Interface
- Modern design system with CSS custom properties
- Dark/light theme support through CSS variables
- Responsive design for mobile and desktop
- Toast notifications for user feedback

## Data Flow

1. **Authentication Flow**: User logs in → credentials validated against stored users → session established in localStorage → protected routes accessible
2. **Media Upload Flow**: File selected → validation (type/size) → conversion to base64 → saved to localStorage and server storage → gallery updated
3. **Gallery Display Flow**: Media items loaded from storage → filtered by category → displayed in responsive grid → modal opens on click
4. **Admin Management Flow**: Admin users can upload media, manage users, delete content with ownership validation

## External Dependencies

### Frontend Dependencies
- **shadcn/ui**: Complete UI component library
- **Radix UI**: Primitive components for accessibility
- **TanStack Query**: Server state management
- **Wouter**: Lightweight routing
- **Tailwind CSS**: Utility-first styling

### Backend Dependencies
- **Drizzle ORM**: Type-safe database operations
- **Multer**: File upload handling
- **@neondatabase/serverless**: PostgreSQL connection
- **Express**: Web framework

### Development Dependencies
- **Vite**: Build tool and dev server
- **TypeScript**: Type safety
- **ESBuild**: Production bundling

## Deployment Strategy

The application supports multiple deployment platforms:

### Replit (Current)
- **Development**: Vite dev server with Express API proxy
- **Production**: Static files served by Express with API routes
- **Database**: PostgreSQL with environment-based configuration
- **File Storage**: Local filesystem with uploads directory
- **Build Process**: Vite builds client, ESBuild bundles server

### Vercel (Configured)
- **Architecture**: Serverless functions with static file hosting
- **API Routes**: Serverless functions in `/api` directory
- **Frontend**: Static build served from `/public`
- **File Upload**: Base64 encoding for temporary storage (requires cloud storage for production)
- **Database**: PostgreSQL via environment variables (Neon recommended)
- **Build Command**: `npm run build` (configured)
- **Config File**: `vercel.json` with routing and build settings

#### Vercel Setup
1. Install Vercel CLI: `npm i -g vercel`
2. Deploy: `vercel` command or connect GitHub repository
3. Configure environment variables in Vercel dashboard
4. For file storage, integrate cloud service (Cloudinary, AWS S3, or Vercel Blob)

The application is designed for deployment on both Replit and Vercel, with automatic database provisioning through environment variables.