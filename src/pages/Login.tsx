
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if the user is already logged in and session is valid
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const loginTime = localStorage.getItem('loginTime');
    
    if (isLoggedIn && loginTime) {
      const now = new Date().getTime();
      const lastLogin = parseInt(loginTime, 10);
      const hoursSinceLogin = (now - lastLogin) / (1000 * 60 * 60);
      
      if (hoursSinceLogin < 12) {
        navigate('/');
      } else {
        // Session expired, clear login data
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('loginTime');
        toast({
          title: "Sessão expirada",
          description: "Faça login novamente para continuar.",
          variant: "destructive"
        });
      }
    }
  }, [navigate, toast]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username === 'walter' && password === '9764') {
      // Set login time and status
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('loginTime', new Date().getTime().toString());
      
      toast({
        title: "Login bem-sucedido",
        description: "Bem-vindo ao sistema!",
      });
      
      navigate('/');
    } else {
      toast({
        title: "Erro de login",
        description: "Usuário ou senha incorretos.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Criador de Fluxo de Atendimento</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Usuário
            </label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Digite seu usuário"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Digite sua senha"
            />
          </div>
          <Button type="submit" className="w-full">
            Entrar
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
