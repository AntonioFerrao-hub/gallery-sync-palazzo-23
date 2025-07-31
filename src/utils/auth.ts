import { User } from '../types';

export const AUTH_STORAGE_KEY = 'gallery_auth';
export const USERS_STORAGE_KEY = 'gallery_users';

// Usuário admin padrão
const DEFAULT_ADMIN = {
  id: 'admin-1',
  name: 'Administrador',
  email: 'admin@lebloc.com',
  password: 'admin123', // Em produção, use hash
  role: 'admin' as const
};

export const initializeAdmin = (): void => {
  const existingUsers = localStorage.getItem(USERS_STORAGE_KEY);
  if (!existingUsers) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([DEFAULT_ADMIN]));
  }
};

export const saveUser = (user: User): void => {
  const users = getUsers();
  const existingUserIndex = users.findIndex(u => u.email === user.email);
  
  if (existingUserIndex >= 0) {
    users[existingUserIndex] = user;
  } else {
    users.push(user);
  }
  
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

export const getUsers = (): User[] => {
  const users = localStorage.getItem(USERS_STORAGE_KEY);
  if (!users) {
    initializeAdmin();
    return [DEFAULT_ADMIN];
  }
  return JSON.parse(users);
};

export const findUserByEmail = (email: string): User | null => {
  const users = getUsers();
  return users.find(u => u.email === email) || null;
};

export const setCurrentUser = (user: User): void => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
};

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem(AUTH_STORAGE_KEY);
  return user ? JSON.parse(user) : null;
};

export const logout = (): void => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};