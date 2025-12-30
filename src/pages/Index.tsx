/**
 * @fileoverview Página Index - Redireciona para Dashboard
 * @module pages/Index
 * @version V8.4
 */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SEOHead } from '@/components/SEOHead';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'DP System';
    // Redireciona para o dashboard após verificar autenticação
    const timer = setTimeout(() => {
      navigate('/dashboard', { replace: true });
    }, 100);
    
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <>
      <SEOHead title="DP System" description="Sistema de Departamento Pessoal" />
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    </>
  );
};

export default Index;
