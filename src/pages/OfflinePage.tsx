// V16-030: Offline Page Component
import { WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function OfflinePage() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 p-4 bg-gray-100 rounded-full w-fit">
            <WifiOff className="h-12 w-12 text-gray-400" />
          </div>
          <CardTitle className="text-2xl">Você está offline</CardTitle>
          <CardDescription className="text-base">
            Parece que você perdeu a conexão com a internet.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Algumas funcionalidades podem estar limitadas enquanto você estiver 
            offline. Os dados serão sincronizados automaticamente quando a 
            conexão for restabelecida.
          </p>
          <div className="flex flex-col gap-2">
            <Button onClick={handleRetry} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Tentar novamente
            </Button>
            <Button variant="outline" onClick={() => window.history.back()} className="w-full">
              Voltar
            </Button>
          </div>
          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              💡 Dica: Você ainda pode acessar dados que foram carregados anteriormente
              e realizar algumas operações que serão sincronizadas depois.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default OfflinePage;
