import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { findUserByEmail, saveUser, setCurrentUser, generateId } from '../utils/auth';
import { useToast } from '../hooks/use-toast';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validações
      if (password !== confirmPassword) {
        toast({
          title: "Erro",
          description: "As senhas não coincidem.",
          variant: "destructive"
        });
        return;
      }

      if (password.length < 6) {
        toast({
          title: "Erro",
          description: "A senha deve ter pelo menos 6 caracteres.",
          variant: "destructive"
        });
        return;
      }

      // Verifica se usuário já existe
      if (findUserByEmail(email)) {
        toast({
          title: "Erro",
          description: "Usuário já existe com este email.",
          variant: "destructive"
        });
        return;
      }

      // Cria novo usuário
      const newUser = {
        id: generateId(),
        name,
        email,
        password
      };

      saveUser(newUser);
      
      setCurrentUser(newUser);
      toast({
        title: "Sucesso",
        description: `Conta criada com sucesso! Bem-vindo, ${name}!`
      });
      navigate('/');
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
        <h1 className="auth-title">Registrar</h1>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="text"
            placeholder="Nome completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="auth-input"
            required
          />
          
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
            minLength={6}
          />
          
          <input
            type="password"
            placeholder="Confirmar senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="auth-input"
            required
          />
          
          <button
            type="submit"
            disabled={loading}
            className="auth-button"
          >
            {loading ? 'Criando conta...' : 'Registrar'}
          </button>
        </form>
        
        <div className="auth-link">
          Já tem uma conta? <Link to="/login">Entre aqui</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;