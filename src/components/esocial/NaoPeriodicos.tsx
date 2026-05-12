import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

export function S2200Admissao({ dados }: { dados: any }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-[10px] uppercase text-muted-foreground">Trabalhador</Label>
          <p className="font-bold">{dados.nmTrab || 'Não informado'}</p>
          <p className="text-xs text-muted-foreground">CPF: {dados.cpfTrab}</p>
        </div>
        <div>
          <Label className="text-[10px] uppercase text-muted-foreground">Admissão</Label>
          <p className="font-bold">{dados.dtAdm || '-'}</p>
          <Badge variant="outline" className="mt-1">Matrícula: {dados.matricula || '-'}</Badge>
        </div>
      </div>
      <div className="p-3 bg-muted/30 rounded-lg">
        <Label className="text-[10px] uppercase text-muted-foreground block mb-1">Dados Contratuais</Label>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div><span className="opacity-70">Cargo:</span> {dados.codCargo}</div>
          <div><span className="opacity-70">Salário:</span> R$ {dados.vrSalFx}</div>
          <div><span className="opacity-70">Regime:</span> {dados.tpRegTrab === '1' ? 'CLT' : 'Estatutário'}</div>
        </div>
      </div>
    </div>
  );
}

export function S2230Afastamento({ dados }: { dados: any }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <Label className="text-[10px] uppercase text-muted-foreground">Colaborador</Label>
          <p className="font-bold">CPF: {dados.cpfTrab}</p>
        </div>
        <Badge variant="destructive">Motivo: {dados.codMotAfast}</Badge>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-lg">
          <Label className="text-[10px] text-blue-700 uppercase">Início do Afastamento</Label>
          <p className="text-lg font-display font-bold text-blue-900">{dados.dtIniAfast || '-'}</p>
        </div>
        <div className="p-3 bg-muted/50 rounded-lg">
          <Label className="text-[10px] uppercase text-muted-foreground">Término Previsto</Label>
          <p className="text-lg font-display font-bold">{dados.dtTermAfast || 'Em aberto'}</p>
        </div>
      </div>
    </div>
  );
}
