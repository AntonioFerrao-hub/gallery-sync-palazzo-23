import { useState, useEffect } from 'react';
import { useToast } from './use-toast';

export interface User {
  id: number;
  username: string;
  role: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
  isLoading: boolean;
}

export function useAuth(): AuthContextType {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for stored auth data on mount
    const storedUser = localStorage.getItem('gallery_user');
    const storedToken = localStorage.getItem('gallery_token');

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (error) {
        console.error('Error parsing stored auth data:', error);
        localStorage.removeItem('gallery_user');
        localStorage.removeItem('gallery_token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast({
          title: "Erro no login",
          description: errorData.error || "Credenciais inválidas",
          variant: "destructive",
        });
        return false;
      }

      const data = await response.json();
      setUser(data.user);
      setToken(data.token);

      // Store in localStorage
      localStorage.setItem('gallery_user', JSON.stringify(data.user));
      localStorage.setItem('gallery_token', data.token);

      toast({
        title: "Login realizado",
        description: `Bem-vindo, ${data.user.username}!`,
      });

      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Erro no login",
        description: "Erro de conexão com o servidor",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('gallery_user');
    localStorage.removeItem('gallery_token');
    
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso",
    });
  };

  return {
    user,
    token,
    login,
    logout,
    isAdmin: user?.role === 'admin',
    isLoading,
  };
}