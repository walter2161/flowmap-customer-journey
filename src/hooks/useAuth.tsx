
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

export const useAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const checkAuth = () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const loginTime = localStorage.getItem('loginTime');
    
    if (!isLoggedIn || !loginTime) {
      navigate('/login');
      return false;
    }
    
    const now = new Date().getTime();
    const lastLogin = parseInt(loginTime, 10);
    const hoursSinceLogin = (now - lastLogin) / (1000 * 60 * 60);
    
    if (hoursSinceLogin >= 12) {
      // Session expired, clear login data
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('loginTime');
      
      toast({
        title: "Sessão expirada",
        description: "Faça login novamente para continuar.",
        variant: "destructive"
      });
      
      navigate('/login');
      return false;
    }
    
    return true;
  };

  const logout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('loginTime');
    navigate('/login');
  };

  return { checkAuth, logout };
};

// Auth protected route component
export const AuthCheck = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const loginTime = localStorage.getItem('loginTime');
    
    if (!isLoggedIn || !loginTime) {
      navigate('/login');
      return;
    }
    
    const now = new Date().getTime();
    const lastLogin = parseInt(loginTime, 10);
    const hoursSinceLogin = (now - lastLogin) / (1000 * 60 * 60);
    
    if (hoursSinceLogin >= 12) {
      // Session expired, clear login data
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('loginTime');
      
      toast({
        title: "Sessão expirada",
        description: "Faça login novamente para continuar.",
        variant: "destructive"
      });
      
      navigate('/login');
    }
  }, [navigate, toast]);

  return <>{children}</>;
};
