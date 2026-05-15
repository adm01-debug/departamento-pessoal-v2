import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Gift, CheckCircle2, Circle, AlertCircle, Info, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { useBeneficios, useBeneficiosColaborador } from '@/hooks';
import { Skeleton } from '@/components/ui/skeleton';

export function BeneficiosPortal({ colaboradorId }: { colaboradorId: string }) {
  const { beneficios: todosBeneficios, isLoading: loadingTodos } = useBeneficios();
  const { beneficios: meusBeneficios, isLoading: loadingMeus, vincularBeneficio, desvincularBeneficio } = useBeneficiosColaborador(colaboradorId);

  const formatCurrency = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  if (loadingTodos || loadingMeus) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-40 w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-display font-bold">Portal de Benefícios</h2>
          <p className="text-sm text-muted-foreground">Escolha e gerencie suas vantagens corporativas</p>
        </div>
        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
          Vigência: {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.isArray(todosBeneficios) && todosBeneficios.map((b: any, idx: number) => {
          const jaPossui = Array.isArray(meusBeneficios) ? meusBeneficios.find((mb: any) => mb.beneficio_id === b.id) : null;

          
          return (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className={`overflow-hidden border transition-all hover:shadow-md ${jaPossui ? 'border-primary/30 bg-primary/5' : 'border-border/30'}`}>
                <div className={`h-1.5 ${jaPossui ? 'bg-primary' : 'bg-muted'}`} />
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <Gift className={`h-4 w-4 ${jaPossui ? 'text-primary' : 'text-muted-foreground'}`} />
                      {b.nome}
                    </CardTitle>
                    {jaPossui ? (
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground/30" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">Valor do Benefício</p>
                      <p className="text-lg font-display font-bold">{formatCurrency(b.valor || 0)}</p>
                    </div>
                    
                    <div className="text-[11px] text-muted-foreground bg-background/50 p-2 rounded-lg border border-border/20">
                      <p>{b.descricao || 'Benefício padrão oferecido pela empresa para todos os colaboradores elegíveis.'}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <Badge variant="secondary" className="text-[9px] uppercase">
                        {b.tipo}
                      </Badge>
                      <Button 
                        variant={jaPossui ? "outline" : "default"} 
                        size="sm" 
                        className="h-7 text-[10px]"
                        onClick={() => jaPossui ? desvincularBeneficio(jaPossui.id) : vincularBeneficio({ beneficio_id: b.id })}
                      >
                        {jaPossui ? 'Cancelar' : 'Solicitar'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <Card className="bg-muted/30 border-none rounded-2xl">
        <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10 text-warning">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold">Regras de Coparticipação</p>
              <p className="text-[10px] text-muted-foreground">Consulte as taxas de desconto para planos de saúde e odontológicos em sua convenção coletiva.</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="h-8 gap-2 text-xs">
            <ExternalLink className="h-3 w-3" /> Ver Regulamento
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
