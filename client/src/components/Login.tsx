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
      const user = findUserByEmail(email);
      
      if (!user) {
        toast({
          title: "Erro",
          description: "Usuário não encontrado. Verifique o email ou registre-se.",
          variant: "destructive"
        });
        return;
      }

      // Verifica senha diretamente do objeto user
      if (user.password !== password) {
        toast({
          title: "Erro",
          description: "Senha incorreta.",
          variant: "destructive"
        });
        return;
      }

      setCurrentUser(user);
      toast({
        title: "Sucesso",
        description: `Bem-vindo, ${user.name}!`
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