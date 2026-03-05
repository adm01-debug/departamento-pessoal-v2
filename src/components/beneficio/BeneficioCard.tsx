// @ts-nocheck
// V15-261: src/components/beneficio/BeneficioCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gift, CreditCard, Heart, Bus, Utensils } from 'lucide-react';
import type { Beneficio } from '@/types';

interface BeneficioCardProps {
  beneficio: Beneficio;
}

const iconMap: Record<string, any> = {
  vale_transporte: Bus,
  vale_refeicao: Utensils,
  vale_alimentacao: Utensils,
  plano_saude: Heart,
  plano_odontologico: Heart,
  default: Gift,
};

export function BeneficioCard({ beneficio }: BeneficioCardProps) {
  const Icon = iconMap[beneficio.tipo] || iconMap.default;
  const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <div className="p-2 bg-primary/10 rounded"><Icon className="h-5 w-5 text-primary" /></div>
        <div className="flex-1">
          <CardTitle className="text-base">{beneficio.nome}</CardTitle>
          <Badge variant={beneficio.ativo ? 'default' : 'secondary'} className="mt-1">{beneficio.ativo ? 'Ativo' : 'Inativo'}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><p className="text-muted-foreground">Valor Empresa</p><p className="font-medium">{fmt(beneficio.valor_empresa)}</p></div>
          <div><p className="text-muted-foreground">Desconto</p><p className="font-medium">{fmt(beneficio.valor_colaborador)}</p></div>
        </div>
        {beneficio.fornecedor && <p className="text-sm text-muted-foreground mt-4">Fornecedor: {beneficio.fornecedor}</p>}
      </CardContent>
    </Card>
  );
}
