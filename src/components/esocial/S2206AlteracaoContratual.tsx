import { Label } from '@/components/ui/label';

export function S2206AlteracaoContratual({ dados }: { dados: any }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-[10px] uppercase text-muted-foreground">Trabalhador</Label>
          <p className="font-bold">CPF: {dados.cpfTrab}</p>
        </div>
        <div>
          <Label className="text-[10px] uppercase text-muted-foreground">Data da Alteração</Label>
          <p className="font-bold">{dados.dtAlteracao || '-'}</p>
        </div>
      </div>
      <div className="p-3 bg-muted/30 rounded-lg">
        <Label className="text-[10px] uppercase text-muted-foreground block mb-1">Novas Condições</Label>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div><span className="opacity-70">Salário:</span> R$ {dados.vrSalFx}</div>
          <div><span className="opacity-70">Unidade:</span> {dados.undSalFixo}</div>
        </div>
      </div>
    </div>
  );
}
