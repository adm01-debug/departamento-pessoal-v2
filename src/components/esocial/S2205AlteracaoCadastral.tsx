import { Label } from '@/components/ui/label';

export function S2205AlteracaoCadastral({ dados }: { dados: any }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-[10px] uppercase text-muted-foreground">Trabalhador</Label>
          <p className="font-bold">{dados.nmTrab || '-'}</p>
        </div>
        <div>
          <Label className="text-[10px] uppercase text-muted-foreground">Data da Alteração</Label>
          <p className="font-bold">{dados.dtAlteracao || '-'}</p>
        </div>
      </div>
      <p className="text-xs text-muted-foreground italic">Atualização de dados cadastrais (endereço, estado civil, escolaridade, etc).</p>
    </div>
  );
}
