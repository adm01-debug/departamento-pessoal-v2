import { Label } from '@/components/ui/label';

export function S2210SST({ dados }: { dados: any }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-[10px] uppercase text-muted-foreground">Trabalhador</Label>
          <p className="font-bold">CPF: {dados.cpfTrab}</p>
        </div>
        <div>
          <Label className="text-[10px] uppercase text-muted-foreground">Data do Acidente</Label>
          <p className="font-bold text-destructive">{dados.dtAcid || '-'}</p>
        </div>
      </div>
    </div>
  );
}
