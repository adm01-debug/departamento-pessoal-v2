import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
export default function Integracoes() {
  return (<div className="container mx-auto p-6"><Card><CardHeader><CardTitle>Integrações</CardTitle></CardHeader><CardContent><div className="grid gap-4"><div className="p-4 border rounded">Bitrix24</div><div className="p-4 border rounded">eSocial</div><div className="p-4 border rounded">Contabilidade</div></div></CardContent></Card></div>);
}
