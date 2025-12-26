import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
export default function Suporte() {
  return (<div className="container mx-auto p-6"><Card><CardHeader><CardTitle>Suporte Técnico</CardTitle></CardHeader><CardContent><form className="space-y-4"><Input placeholder="Assunto" /><Textarea placeholder="Descreva seu problema" /><Button type="submit">Enviar</Button></form></CardContent></Card></div>);
}
