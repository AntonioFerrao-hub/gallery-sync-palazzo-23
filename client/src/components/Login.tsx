import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { findUserByEmail, setCurrentUser } from '../utils/auth';
import { useToast } from '../hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Erro",
          description: data.error || "Erro ao fazer login",
          variant: "destructive"
        });
        return;
      }

      setCurrentUser(data.user);
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      
      toast({
        title: "Sucesso",
        description: `Bem-vindo, ${data.user.name}!`
      });
      setLocation('/admin');
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro interno. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Entrar</h1>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
            required
          />
          
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input"
            required
          />
          
          <button
            type="submit"
            disabled={loading}
            className="auth-button"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        
      </div>
    </div>
  );
};

export default Login;