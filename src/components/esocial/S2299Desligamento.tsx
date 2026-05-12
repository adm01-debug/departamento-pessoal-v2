import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

export function S2299Desligamento({ dados }: { dados: any }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <Label className="text-[10px] uppercase text-muted-foreground">Trabalhador</Label>
          <p className="font-bold">CPF: {dados.cpfTrab}</p>
        </div>
        <Badge variant="destructive">Motivo: {dados.mtvDeslig}</Badge>
      </div>
      <div className="p-3 bg-red-50/50 border border-red-100 rounded-lg">
        <Label className="text-[10px] text-red-700 uppercase">Data do Desligamento</Label>
        <p className="text-lg font-display font-bold text-red-900">{dados.dtDeslig || '-'}</p>
      </div>
    </div>
  );
}
