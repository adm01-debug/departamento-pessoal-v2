import { memo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';

const itens = [
  { id: 1, item: 'Comunicação formal ao colaborador' },
  { id: 2, item: 'Agendamento exame demissional' },
  { id: 3, item: 'Cálculo de rescisão' },
  { id: 4, item: 'Baixa CTPS Digital' },
  { id: 5, item: 'TRCT - Termo de Rescisão' },
  { id: 6, item: 'Guia FGTS/GRRF' },
  { id: 7, item: 'Seguro desemprego (se aplicável)' },
  { id: 8, item: 'Devolução de equipamentos' },
  { id: 9, item: 'Revogação de acessos' },
  { id: 10, item: 'Entrevista de desligamento' },
  { id: 11, item: 'eSocial S-2299' },
  { id: 12, item: 'Pagamento rescisão' },
];

function ChecklistDesligamento({ colaboradorId }: { colaboradorId: string }) {
  const [done, setDone] = useState<number[]>([]);
  const prog = (done.length / itens.length) * 100;
  const toggle = (id: number) => setDone(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Checklist Desligamento</CardTitle>
        <Progress value={prog} className="mt-2" />
      </CardHeader>
      <CardContent className="space-y-2">
        {itens.map(i => (
          <div key={i.id} className="flex items-center gap-2">
            <Checkbox checked={done.includes(i.id)} onCheckedChange={() => toggle(i.id)} />
            <span className={done.includes(i.id) ? 'line-through opacity-50' : ''}>{i.item}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
export default memo(ChecklistDesligamento);