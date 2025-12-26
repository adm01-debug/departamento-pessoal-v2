import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
export default function Backup() {
  return (<div className="container mx-auto p-6"><Card><CardHeader><CardTitle>Backup e Restauração</CardTitle></CardHeader><CardContent><div className="space-y-4"><Button>Criar Backup</Button><Button variant="outline">Restaurar Backup</Button></div></CardContent></Card></div>);
}
