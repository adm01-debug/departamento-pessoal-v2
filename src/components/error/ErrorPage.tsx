import { useNavigate } from 'react-router-dom';
import { AlertCircle, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
interface ErrorPageProps { code?: number; title?: string; message?: string; }
export function ErrorPage({ code = 500, title = 'Erro', message = 'Ocorreu um erro inesperado.' }: ErrorPageProps) {
  const navigate = useNavigate();
  return (<div className="flex min-h-screen flex-col items-center justify-center p-4"><AlertCircle className="h-16 w-16 text-destructive mb-4" /><h1 className="text-4xl font-bold">{code}</h1><h2 className="text-xl font-semibold mt-2">{title}</h2><p className="text-muted-foreground mt-1 text-center max-w-md">{message}</p><div className="flex gap-2 mt-6"><Button variant="outline" onClick={() => navigate(-1)}><ArrowLeft className="mr-2 h-4 w-4" />Voltar</Button><Button onClick={() => navigate('/')}><Home className="mr-2 h-4 w-4" />Início</Button></div></div>);
}
