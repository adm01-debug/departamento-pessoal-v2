import { Label } from '@/components/ui/label';

export function S2306TSVAlteracao({ dados }: { dados: any }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-[10px] uppercase text-muted-foreground">Trabalhador (TSV)</Label>
          <p className="font-bold">CPF: {dados.cpfTrab}</p>
        </div>
        <div>
          <Label className="text-[10px] uppercase text-muted-foreground">Data da Alteração</Label>
          <p className="font-bold">{dados.dtAlteracao || '-'}</p>
        </div>
      </div>
    </div>
  );
}
