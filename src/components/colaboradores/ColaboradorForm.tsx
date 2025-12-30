import { memo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ColaboradorFormProps {
  onSubmit?: (data: Record<string, string>) => void;
  initialData?: Record<string, string>;
  className?: string;
}

export const ColaboradorForm = memo(function ColaboradorForm({ onSubmit, initialData = {}, className }: ColaboradorFormProps) {
  const [nome, setNome] = useState(initialData.nome || '');
  const [email, setEmail] = useState(initialData.email || '');
  const [cargo, setCargo] = useState(initialData.cargo || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({ nome, email, cargo });
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Dados do Colaborador</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome Completo</Label>
            <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cargo">Cargo</Label>
            <Input id="cargo" value={cargo} onChange={(e) => setCargo(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full">Salvar</Button>
        </form>
      </CardContent>
    </Card>
  );
});

export default ColaboradorForm;
