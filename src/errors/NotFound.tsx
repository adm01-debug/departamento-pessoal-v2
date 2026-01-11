// V15-346
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
export function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-muted-foreground/20">404</h1>
        <h2 className="text-2xl font-bold mt-4">Página não encontrada</h2>
        <p className="text-muted-foreground mt-2">A página que você procura não existe ou foi movida.</p>
        <div className="flex gap-4 justify-center mt-6">
          <Button variant="outline" onClick={() => navigate(-1)}><ArrowLeft className="h-4 w-4 mr-2" />Voltar</Button>
          <Button onClick={() => navigate('/')}><Home className="h-4 w-4 mr-2" />Início</Button>
        </div>
      </div>
    </div>
  );
}
