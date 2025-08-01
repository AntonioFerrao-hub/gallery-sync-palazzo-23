# LEBLOC Gallery Application

## Overview

LEBLOC Gallery is a full-stack web application designed for managing and displaying media galleries for events and services. Its primary purpose is to provide a robust platform for users to upload, organize, and showcase visual content. Key capabilities include comprehensive media management, user authentication, and a dynamic gallery display. The project aims to offer a streamlined solution for media presentation, targeting users who need an efficient way to publish and manage visual collections.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript and Vite.
- **UI Library**: shadcn/ui components built on Radix UI.
- **Styling**: Tailwind CSS with a custom design system.
- **Routing**: Wouter for client-side navigation.
- **State Management**: TanStack Query for server state and localStorage for client-side persistence.

### Backend Architecture
- **Framework**: Express.js with TypeScript.
- **Database**: PostgreSQL with Drizzle ORM.
- **File Handling**: Multer for media uploads with local file storage.
- **Session Management**: In-memory storage with a fallback authentication system.

### Core Features & Design
- **Authentication System**: Includes user types (Admin, regular), default admin creation, localStorage-based session management, and role-based route protection.
- **Category Management**: Allows dynamic creation, editing, and deletion of photo categories via the admin interface, with validation to prevent deletion of categories containing photos and visual indicators for photo count limits.
- **Photo Management**: Supports file validation (size, type), category-based photo limits (20 per category), metadata editing (title, description, links), and automatic physical file cleanup upon deletion.
- **Gallery Display & Navigation**: Organizes photos by category in a responsive grid, featuring interactive modals for full-screen viewing and category-based filtering.
- **Admin Interface**: Provides a tabbed interface (Categories, Gallery, Upload, Users) with real-time updates, status indicators, and robust data validation.
- **UI/UX Decisions**: Utilizes shadcn/ui for accessible components, ensuring a consistent design system with dark/light theme support.

### Technical Implementation
- **Database Schema**: Defines `User`, `Category`, and `Photo` tables with relevant fields and relationships.
- **API Endpoints**: Structured RESTful API for managing categories, photos, and users.
- **Data Flow**: Includes detailed flows for authentication, category management, photo upload, and photo management, emphasizing validation and UI updates.
- **Storage Strategy**: Uses PostgreSQL for persistent data, local filesystem for media files, and localStorage for user sessions.

## External Dependencies

### Frontend Dependencies
- **shadcn/ui**: UI component library.
- **Radix UI**: Primitive components for accessibility.
- **TanStack Query**: Server state management.
- **Wouter**: Lightweight routing library.
- **Tailwind CSS**: Utility-first CSS framework.

### Backend Dependencies
- **Drizzle ORM**: Type-safe database operations.
- **Multer**: Middleware for handling `multipart/form-data` for file uploads.
- **@neondatabase/serverless**: PostgreSQL connection.
- **Express**: Web application framework.

### Development Dependencies
- **Vite**: Build tool and development server.
- **TypeScript**: Superset of JavaScript for type safety.
- **ESBuild**: Fast JavaScript bundler.
- **Drizzle Kit**: Database schema management and migrations.