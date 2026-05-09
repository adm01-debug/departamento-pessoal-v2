import { Card, CardContent } from '@/components/ui/card';
import { useBeneficiosColaborador } from '@/hooks/useBeneficiosColaborador';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Gift } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';

interface BeneficiosTabProps {
  colaboradorId: string;
}

export function BeneficiosTab({ colaboradorId }: BeneficiosTabProps) {
  const { beneficios, isLoading, desvincularBeneficio } = useBeneficiosColaborador(colaboradorId);

  const formatCurrency = (v: number | null) => (v ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  if (isLoading) return <div className="flex justify-center p-8"><Spinner /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-display font-bold flex items-center gap-2">
          <Gift className="h-5 w-5 text-primary" /> Benefícios Ativos
        </h3>
        <Button size="sm" className="rounded-xl gap-2">
          <Plus className="h-4 w-4" /> Vincular Benefício
        </Button>
      </div>

      <Card className="border border-border/30 rounded-2xl overflow-hidden shadow-elevated">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="font-display font-semibold">Benefício</TableHead>
                <TableHead className="font-display font-semibold">Tipo</TableHead>
                <TableHead className="font-display font-semibold">Valor</TableHead>
                <TableHead className="font-display font-semibold">Desconto</TableHead>
                <TableHead className="font-display font-semibold">Início</TableHead>
                <TableHead className="font-display font-semibold">Status</TableHead>
                <TableHead className="w-[50px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {beneficios.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-muted-foreground font-body">
                    Nenhum benefício vinculado a este colaborador.
                  </TableCell>
                </TableRow>
              ) : (
                beneficios.map((b: any) => (
                  <TableRow key={b.id} className="hover:bg-accent/30 transition-colors">
                    <TableCell className="font-body font-medium">{b.beneficio?.nome}</TableCell>
                    <TableCell className="font-body capitalize text-xs">{b.beneficio?.tipo || '-'}</TableCell>
                    <TableCell className="font-body text-success font-semibold">{formatCurrency(b.valor)}</TableCell>
                    <TableCell className="font-body text-destructive font-semibold">{formatCurrency(b.desconto)}</TableCell>
                    <TableCell className="font-body text-xs">{b.data_inicio ? new Date(b.data_inicio).toLocaleDateString('pt-BR') : '-'}</TableCell>
                    <TableCell>
                      <Badge className={b.ativo ? 'bg-success/15 text-success border-0' : 'bg-muted text-muted-foreground border-0'}>
                        {b.ativo ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="rounded-xl text-destructive hover:bg-destructive/10"
                        onClick={() => desvincularBeneficio(b.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
