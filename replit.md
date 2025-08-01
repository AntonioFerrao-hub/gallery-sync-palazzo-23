# LEBLOC Gallery Application

## Overview

LEBLOC Gallery is a full-stack web application for managing and displaying media galleries for events and services. The application features a React frontend with shadcn/ui components, an Express.js backend, and uses PostgreSQL with Drizzle ORM for data persistence. The system includes user authentication, media upload/management, and a gallery display with modal navigation.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

**2025-01-31**: Configured Vercel deployment support
- ✓ Created `vercel.json` configuration file
- ✓ Set up serverless API functions in `/api` directory
- ✓ Added file upload handler for Vercel environment
- ✓ Created build script and deployment documentation
- ✓ Configured routing for static files and API endpoints

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

## Application Structure

### Frontend Pages and Components
- **Index Page** (`/`): Public gallery with media display and filtering
- **Admin Panel** (`/admin`): Protected admin interface with tabs for gallery and user management
- **Login Page** (`/login`): Authentication interface with form validation
- **NotFound Page**: 404 error handling with user-friendly messaging

### Core Components
- **Header**: Navigation bar with login/logout functionality
- **GallerySection**: Media grid with category filtering and responsive layout
- **MediaModal/SimpleMediaModal**: Full-screen media viewer with navigation
- **UploadModal**: File upload interface with drag-and-drop support
- **UserManagement**: Admin interface for managing users and permissions
- **ProtectedRoute**: Route guard component for admin access control

### UI Component Library (shadcn/ui)
- Complete set of accessible components built on Radix UI
- Button, Input, Dialog, Tabs, Toast, Badge, and more
- Consistent design system with CSS custom properties
- Dark/light theme support through CSS variables

## Key Features

### Authentication System
- **User Types**: Admin and regular users with role-based access
- **Default Admin**: admin@lebloc.com / admin123 (auto-created)
- **Session Management**: localStorage-based persistence with automatic initialization
- **Route Protection**: Protected admin routes with redirect logic

### Media Management
- **File Types**: Images (JPG, PNG, GIF) and Videos (MP4, WebM)
- **Size Limits**: 2MB for images, 20GB for videos
- **Storage**: Local filesystem with uploads directory + localStorage fallback
- **Categories**: Estrutura, Formatura, Casamento, Corporativo, Eventos Sociais
- **Upload Methods**: Form-based upload with file validation

### Gallery Display
- **Layout**: Responsive CSS Grid with automatic sizing
- **Filtering**: Category-based filtering with "Todos" option
- **Modal Viewer**: Full-screen display with navigation controls
- **Media Preview**: Automatic thumbnail generation for videos
- **Responsive Design**: Mobile-first approach with breakpoint optimization

### Admin Features
- **Dual Interface**: Tabbed admin panel (Gallery + Users)
- **Media Management**: Upload, view, and delete media with ownership validation
- **User Management**: Create, edit, and manage user accounts
- **Permissions**: Admin-only access to sensitive operations

## Technical Implementation

### Data Models and Types
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'user';
}

interface MediaItem {
  id: string;
  title: string;
  category: Category;
  type: 'image' | 'video';
  url: string;
  thumbnailUrl?: string;
  userId: string;
  createdAt: string;
  size: number;
  filename: string;
}

type Category = 'Estrutura' | 'Formatura' | 'Casamento' | 'Corporativo' | 'Eventos Sociais';
```

### Data Flow
1. **Authentication Flow**: User login → credential validation → localStorage session → route access
2. **Media Upload Flow**: File selection → validation → base64 conversion → dual storage (localStorage + server)
3. **Gallery Display Flow**: Media loading → category filtering → grid rendering → modal interaction
4. **Admin Management Flow**: Authentication check → admin interface → CRUD operations → data persistence

### Storage Strategy
- **Primary Storage**: localStorage for client-side persistence and offline capability
- **Server Storage**: Local filesystem (`/uploads`) for production file serving
- **Fallback System**: Base64 encoding in localStorage when server storage fails
- **Session Data**: User authentication and preferences in localStorage

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

## File Structure

```
/
├── client/                     # Frontend React application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── ui/            # shadcn/ui component library
│   │   │   ├── GallerySection.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── MediaModal.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   ├── UploadModal.tsx
│   │   │   └── UserManagement.tsx
│   │   ├── pages/             # Application pages
│   │   │   ├── Admin.tsx      # Admin dashboard
│   │   │   ├── Index.tsx      # Public gallery
│   │   │   └── NotFound.tsx   # 404 handler
│   │   ├── types/             # TypeScript definitions
│   │   ├── utils/             # Utility functions
│   │   │   ├── auth.ts        # Authentication logic
│   │   │   ├── media.ts       # Media handling
│   │   │   └── sampleData.ts  # Initial data
│   │   ├── hooks/             # Custom React hooks
│   │   ├── lib/               # Configuration and setup
│   │   └── assets/            # Static images and media
│   ├── index.html             # HTML template
│   └── public/                # Static assets
├── server/                     # Backend Express application
│   ├── index.ts               # Server entry point
│   ├── routes.ts              # API routes and middleware
│   ├── storage.ts             # Data storage interface
│   └── vite.ts                # Vite development setup
├── shared/                     # Shared code between client/server
│   └── schema.ts              # Database schema (Drizzle)
├── api/                       # Vercel serverless functions
│   ├── media/upload.ts        # File upload endpoint
│   └── uploads/[...path].ts   # Static file serving
├── uploads/                   # Local file storage directory
├── vercel.json                # Vercel deployment configuration
├── build.sh                   # Build script for deployment
├── README-VERCEL.md           # Vercel deployment guide
└── package.json               # Dependencies and scripts
```

## Development Workflow

### Local Development (Replit)
1. **Start Server**: `npm run dev` (Express + Vite)
2. **Database**: PostgreSQL via environment variables
3. **Hot Reload**: Automatic file watching and server restart
4. **File Storage**: Local uploads directory

### Production Build
1. **Frontend Build**: `vite build` → `dist/public/`
2. **Backend Bundle**: `esbuild` → `dist/index.js`
3. **Static Serving**: Express serves built files
4. **Database Migration**: `npm run db:push`

### Vercel Deployment
1. **Serverless APIs**: Functions in `/api` directory
2. **Static Hosting**: Built files served from CDN
3. **Environment Variables**: Database and configuration
4. **File Storage**: Requires external service (Cloudinary, S3, etc.)