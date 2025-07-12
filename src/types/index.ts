export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'user';
}

export interface MediaItem {
  id: string;
  title: string;
  category: string;
  type: 'image' | 'video';
  url: string;
  thumbnailUrl?: string;
  userId: string;
  createdAt: string;
  size: number;
  filename: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export type Category = 'Estrutura' | 'Formatura' | 'Casamento' | 'Corporativo' | 'Eventos Sociais';

export const CATEGORIES: Category[] = [
  'Estrutura',
  'Formatura', 
  'Casamento',
  'Corporativo',
  'Eventos Sociais'
];

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm'];
export const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
export const MAX_VIDEO_SIZE = 20 * 1024 * 1024 * 1024; // 20GB