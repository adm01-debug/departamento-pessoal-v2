import { memo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { User, Save } from 'lucide-react';
interface PerfilFormProps { dados: { nome: string; email: string; telefone?: string }; onSave: (dados: any) => void; }
export const PerfilForm = memo(function PerfilForm({ dados, onSave }: PerfilFormProps) {
  const [form, setForm] = useState(dados);
  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><User className="h-5 w-5" />Dados Pessoais</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2"><Label>Nome</Label><Input value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} /></div>
        <div className="space-y-2"><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
        <div className="space-y-2"><Label>Telefone</Label><Input value={form.telefone || ''} onChange={e => setForm({...form, telefone: e.target.value})} /></div>
        <Button onClick={() => onSave(form)}><Save className="h-4 w-4 mr-2" />Salvar</Button>
      </CardContent>
    </Card>
  );
});
