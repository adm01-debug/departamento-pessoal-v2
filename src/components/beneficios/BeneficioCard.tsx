/**
 * @fileoverview Card de benefício com informações e valor
 * @module components/beneficios/BeneficioCard
 */
import { memo } from 'react';
import { Heart, Bus, Utensils, GraduationCap, Shield, Gift, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

type TipoBeneficio = 'saude' | 'vale_transporte' | 'vale_refeicao' | 'vale_alimentacao' | 'educacao' | 'seguro_vida' | 'outros';

interface BeneficioCardProps {
  id: string;
  nome: string;
  tipo: TipoBeneficio;
  valor?: number;
  desconto?: number;
  descricao?: string;
  ativo: boolean;
  colaboradoresAtivos?: number;
  onToggle?: (id: string, ativo: boolean) => void;
  onConfigurar?: (id: string) => void;
}

const tipoConfig: Record<TipoBeneficio, { icon: typeof Heart; color: string; bgColor: string }> = {
  saude: { icon: Heart, color: 'text-red-500', bgColor: 'bg-red-100' },
  vale_transporte: { icon: Bus, color: 'text-blue-500', bgColor: 'bg-blue-100' },
  vale_refeicao: { icon: Utensils, color: 'text-orange-500', bgColor: 'bg-orange-100' },
  vale_alimentacao: { icon: Utensils, color: 'text-green-500', bgColor: 'bg-green-100' },
  educacao: { icon: GraduationCap, color: 'text-purple-500', bgColor: 'bg-purple-100' },
  seguro_vida: { icon: Shield, color: 'text-indigo-500', bgColor: 'bg-indigo-100' },
  outros: { icon: Gift, color: 'text-gray-500', bgColor: 'bg-gray-100' },
};

/**
 * Formata valor em moeda brasileira
 */
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

/**
 * Card de benefício com configurações
 * @param props - Propriedades do benefício
 * @returns Elemento React
 */
export const BeneficioCard = memo(function BeneficioCard({
  id,
  nome,
  tipo,
  valor,
  desconto,
  descricao,
  ativo,
  colaboradoresAtivos = 0,
  onToggle,
  onConfigurar,
}: BeneficioCardProps) {
  const config = tipoConfig[tipo];
  const Icon = config.icon;

  return (
    <Card className={`transition-colors ${!ativo ? 'opacity-60' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${config.bgColor}`}>
              <Icon className={`h-5 w-5 ${config.color}`} />
            </div>
            <div>
              <CardTitle className="text-base">{nome}</CardTitle>
              {descricao && (
                <p className="text-sm text-muted-foreground line-clamp-1">{descricao}</p>
              )}
            </div>
          </div>
          {onToggle && (
            <Switch
              checked={ativo}
              onCheckedChange={(checked) => onToggle(id, checked)}
            />
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          {valor !== undefined && (
            <div>
              <p className="text-xs text-muted-foreground">Valor</p>
              <p className="font-medium">{formatCurrency(valor)}</p>
            </div>
          )}
          {desconto !== undefined && (
            <div>
              <p className="text-xs text-muted-foreground">Desconto</p>
              <p className="font-medium">{formatCurrency(desconto)}</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            <Badge variant="outline">{colaboradoresAtivos} colaboradores</Badge>
          </div>
          {onConfigurar && (
            <Button variant="ghost" size="sm" onClick={() => onConfigurar(id)}>
              <Settings className="h-4 w-4 mr-2" />
              Configurar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
});
