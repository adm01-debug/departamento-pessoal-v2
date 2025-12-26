import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
export default function Sobre() {
  return (<div className="container mx-auto p-6"><Card><CardHeader><CardTitle>Sobre o Sistema</CardTitle></CardHeader><CardContent><div className="space-y-4"><p><strong>Departamento Pessoal</strong> é um sistema completo para gestão de recursos humanos.</p><p><strong>Versão:</strong> 1.2.0</p><p><strong>Desenvolvido por:</strong> Promo Brindes</p><h3 className="font-bold mt-4">Funcionalidades</h3><ul className="list-disc pl-6"><li>Gestão de colaboradores</li><li>Folha de pagamento</li><li>Controle de férias</li><li>Benefícios</li><li>Integrações</li></ul></div></CardContent></Card></div>);
}
