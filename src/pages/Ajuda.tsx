import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
export default function Ajuda() {
  return (<div className="container mx-auto p-6"><Card><CardHeader><CardTitle>Central de Ajuda</CardTitle></CardHeader><CardContent><div className="space-y-4"><p>Bem-vindo ao centro de ajuda do sistema de Departamento Pessoal.</p><ul className="list-disc pl-6"><li>Consulte o FAQ</li><li>Entre em contato com o suporte</li><li>Acesse os tutoriais</li></ul></div></CardContent></Card></div>);
}
