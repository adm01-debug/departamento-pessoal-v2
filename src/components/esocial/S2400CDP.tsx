import { Label } from '@/components/ui/label';

export function S2400CDP({ dados }: { dados: any }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-[10px] uppercase text-muted-foreground">Beneficiário</Label>
          <p className="font-bold">CPF: {dados.cpfBenef}</p>
        </div>
        <div>
          <Label className="text-[10px] uppercase text-muted-foreground">Início do Benefício</Label>
          <p className="font-bold text-primary">{dados.dtIniBenef || '-'}</p>
        </div>
      </div>
    </div>
  );
}
