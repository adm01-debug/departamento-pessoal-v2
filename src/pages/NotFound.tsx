/**
 * @fileoverview Página 404 - Não encontrada
 */
import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFoundPage = memo(function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 p-8">
        <div className="text-9xl font-bold text-muted-foreground/20">404</div>
        <h1 className="text-3xl font-bold">Página não encontrada</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          A página que você está procurando não existe ou foi movida.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild>
            <Link to="/"><Home className="h-4 w-4 mr-2" />Início</Link>
          </Button>
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />Voltar
          </Button>
        </div>
      </div>
    </div>
  );
});

export default NotFoundPage;
