import { Label } from '@/components/ui/label';

export function S2300TSVInicio({ dados }: { dados: any }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-[10px] uppercase text-muted-foreground">Trabalhador sem Vínculo</Label>
          <p className="font-bold">{dados.nmTrab || '-'}</p>
        </div>
        <div>
          <Label className="text-[10px] uppercase text-muted-foreground">Início</Label>
          <p className="font-bold">{dados.dtInicio || '-'}</p>
        </div>
      </div>
      <div className="text-xs">
        <span className="opacity-70 uppercase font-semibold">Categoria:</span> {dados.codCateg}
      </div>
    </div>
  );
}
