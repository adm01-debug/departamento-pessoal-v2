import { Gift, Bus, Utensils, Heart, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockColaboradores } from '@/data/mockData';
import { cn } from '@/lib/utils';

const resumoBeneficios = [
  { tipo: 'VT', icone: '🚌', valor: 4900, colaboradores: 48, color: 'text-info' },
  { tipo: 'VR/VA', icone: '🍽️', valor: 15200, colaboradores: 45, color: 'text-success' },
  { tipo: 'Saúde', icone: '🏥', valor: 12800, colaboradores: 38, color: 'text-destructive' },
  { tipo: 'Odonto', icone: '🦷', valor: 3200, colaboradores: 42, color: 'text-store' },
];

const mockBeneficiosPorColab = [
  { id: '1', nome: 'João Silva', vt: 220, vr: 440, saude: 380, odonto: 80, total: 1120, desconto: 210 },
  { id: '2', nome: 'Maria Costa', vt: 0, vr: 440, saude: 550, odonto: 80, total: 1070, desconto: 0 },
  { id: '3', nome: 'Pedro Lima', vt: 180, vr: 440, saude: 380, odonto: 0, total: 1000, desconto: 175 },
  { id: '4', nome: 'Ana Souza', vt: 200, vr: 440, saude: 380, odonto: 80, total: 1100, desconto: 195 },
];

export default function Beneficios() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      minimumFractionDigits: 0
    }).format(value);
  };

  const totalMensal = resumoBeneficios.reduce((acc, b) => acc + b.valor, 0);
  const descontoTotal = mockBeneficiosPorColab.reduce((acc, c) => acc + c.desconto, 0) * 12; // Estimativa

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Benefícios</h1>
          <p className="text-muted-foreground text-sm">Gestão de vale-transporte, refeição, saúde e outros</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Benefício
        </Button>
      </div>

      {/* Resumo Cards */}
      <div className="p-5 rounded-xl bg-card border border-border">
        <h3 className="font-semibold text-sm text-foreground mb-4">Resumo Mensal (Dezembro/2025)</h3>
        <div className="grid grid-cols-4 gap-4 mb-4">
          {resumoBeneficios.map((b) => (
            <div key={b.tipo} className="p-4 rounded-lg bg-muted/30">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{b.icone}</span>
                <span className={cn("font-semibold text-sm", b.color)}>{b.tipo}</span>
              </div>
              <p className="text-xl font-bold text-foreground">{formatCurrency(b.valor)}</p>
              <p className="text-xs text-muted-foreground">{b.colaboradores} colab.</p>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            <p className="text-sm text-muted-foreground">Total Mensal</p>
            <p className="text-2xl font-bold text-foreground">{formatCurrency(totalMensal)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Desconto Colaboradores (VT 6%)</p>
            <p className="text-xl font-bold text-success">{formatCurrency(5820)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Custo Empresa</p>
            <p className="text-xl font-bold text-foreground">{formatCurrency(30280)}</p>
          </div>
        </div>
      </div>

      {/* Por Colaborador */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/30">
          <h3 className="font-semibold text-sm text-foreground">Benefícios por Colaborador</h3>
        </div>
        <table className="w-full">
          <thead className="bg-muted/30">
            <tr>
              <th className="text-left p-4 text-xs font-semibold text-muted-foreground">Colaborador</th>
              <th className="text-center p-4 text-xs font-semibold text-muted-foreground">🚌 VT</th>
              <th className="text-center p-4 text-xs font-semibold text-muted-foreground">🍽️ VR/VA</th>
              <th className="text-center p-4 text-xs font-semibold text-muted-foreground">🏥 Saúde</th>
              <th className="text-center p-4 text-xs font-semibold text-muted-foreground">🦷 Odonto</th>
              <th className="text-center p-4 text-xs font-semibold text-muted-foreground">Total</th>
              <th className="text-center p-4 text-xs font-semibold text-muted-foreground">Desconto</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {mockBeneficiosPorColab.map((colab) => (
              <tr key={colab.id} className="hover:bg-muted/20 transition-colors">
                <td className="p-4 text-sm font-medium text-foreground">{colab.nome}</td>
                <td className="p-4 text-sm text-center">
                  {colab.vt > 0 ? (
                    <Badge className="bg-success/10 text-success border-0">{colab.vt}</Badge>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </td>
                <td className="p-4 text-sm text-center">
                  <Badge className="bg-success/10 text-success border-0">{colab.vr}</Badge>
                </td>
                <td className="p-4 text-sm text-center">
                  <Badge className="bg-success/10 text-success border-0">{colab.saude}</Badge>
                </td>
                <td className="p-4 text-sm text-center">
                  {colab.odonto > 0 ? (
                    <Badge className="bg-success/10 text-success border-0">{colab.odonto}</Badge>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </td>
                <td className="p-4 text-sm text-center font-semibold text-foreground">{colab.total}</td>
                <td className="p-4 text-sm text-center text-destructive">{colab.desconto > 0 ? colab.desconto : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="outline" className="gap-2">
          📥 Importar Uso VT
        </Button>
        <Button variant="outline" className="gap-2">
          📊 Relatório
        </Button>
        <Button className="gap-2">
          💳 Gerar Pedido Operadora
        </Button>
      </div>
    </div>
  );
}
