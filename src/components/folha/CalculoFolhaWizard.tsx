import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useFolhaAuditoria } from '@/hooks/useFolhaAuditoria';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Calculator, CheckCircle2, Clock, 
  AlertTriangle, ArrowRight, Loader2,
  FileText, Landmark, Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { edgeFunctionsService } from '@/services/edgeFunctionsService';
import { useEmpresas } from '@/hooks/useEmpresas';

interface StepProps {
  isActive: boolean;
  isCompleted: boolean;
  label: string;
  icon: React.ElementType;
}

function Step({ isActive, isCompleted, label, icon: Icon }: StepProps) {
  return (
    <div className="flex flex-col items-center gap-2 flex-1 relative">
      <div className={cn(
        "h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300 z-10",
        isCompleted ? "bg-success text-success-foreground" : 
        isActive ? "bg-primary text-primary-foreground shadow-glow" : 
        "bg-muted text-muted-foreground"
      )}>
        {isCompleted ? <CheckCircle2 className="h-6 w-6" /> : <Icon className="h-5 w-5" />}
      </div>
      <span className={cn(
        "text-[10px] font-bold uppercase tracking-widest text-center",
        isActive ? "text-foreground" : "text-muted-foreground"
      )}>
        {label}
      </span>
    </div>
  );
}

export function CalculoFolhaWizard({ competencia }: { competencia: string }) {
  const { empresaAtualId } = useEmpresas();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentFolhaId, setCurrentFolhaId] = useState<string | null>(null);
  const { registrarLog } = useFolhaAuditoria(currentFolhaId || undefined);
  const queryClient = useQueryClient();

  // Queries for validation
  const { data: pendingPoints } = useQuery({
    queryKey: ['pending-points', empresaAtualId, competencia],
    queryFn: async () => {
      const [mes, ano] = competencia.split('/');
      const { count } = await supabase
        .from('registros_ponto')
        .select('*', { count: 'exact', head: true })
        .eq('empresa_id', empresaAtualId!)
        .is('aprovado', false)
        .gte('data', `${ano}-${mes}-01`)
        .lte('data', `${ano}-${mes}-31`);
      return count || 0;
    },
    enabled: isOpen && currentStep === 1,
  });

  const handleCalculate = async () => {
    setIsProcessing(true);
    try {
      const [mes, ano] = competencia.split('/');
      await edgeFunctionsService.calcularFolha({ 
        empresaId: empresaAtualId!, 
        competencia: `${ano}-${mes}` 
      });
      queryClient.invalidateQueries({ queryKey: ['folha-resumo', competencia] });
      setCurrentStep(4);
      toast.success('Folha processada com sucesso!');
    } catch (err: any) {
      toast.error(`Erro no processamento: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const steps = [
    { id: 1, label: 'Consistência', icon: Clock },
    { id: 2, label: 'Lançamentos', icon: FileText },
    { id: 3, label: 'Processamento', icon: Calculator },
    { id: 4, label: 'Conclusão', icon: CheckCircle2 },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(o) => { setIsOpen(o); if (!o) setCurrentStep(1); }}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="rounded-xl gap-1.5 bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 shadow-lg font-body"
        >
          <Calculator className="h-4 w-4" />
          Assistente de Cálculo
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl overflow-hidden p-0 gap-0">
        <div className="bg-gradient-to-r from-primary to-primary-glow p-6 text-primary-foreground">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm">
              <Calculator className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold">Assistente de Folha</h2>
              <p className="text-xs opacity-80">Competência {competencia}</p>
            </div>
          </div>

          <div className="flex items-center justify-between relative">
            <div className="absolute top-5 left-0 right-0 h-[2px] bg-white/20 -z-0 mx-8" />
            {steps.map((s) => (
              <Step 
                key={s.id} 
                isActive={currentStep === s.id} 
                isCompleted={currentStep > s.id} 
                label={s.label} 
                icon={s.icon} 
              />
            ))}
          </div>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div 
                key="step1" 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-2xl border border-border/30">
                  <div className={cn(
                    "p-2 rounded-xl",
                    pendingPoints && pendingPoints > 0 ? "bg-warning/10 text-warning" : "bg-success/10 text-success"
                  )}>
                    {pendingPoints && pendingPoints > 0 ? <AlertTriangle /> : <CheckCircle2 />}
                  </div>
                  <div>
                    <p className="font-bold text-sm">Registros de Ponto</p>
                    <p className="text-xs text-muted-foreground">
                      {pendingPoints && pendingPoints > 0 
                        ? `Existem ${pendingPoints} batidas aguardando aprovação.` 
                        : "Todos os registros de ponto estão aprovados."}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-border/30 text-sm space-y-2">
                  <p className="font-semibold">O que será verificado:</p>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    <li className="flex items-center gap-2"><div className="h-1 w-1 rounded-full bg-primary" /> Faltas não justificadas</li>
                    <li className="flex items-center gap-2"><div className="h-1 w-1 rounded-full bg-primary" /> Banco de horas pendente</li>
                    <li className="flex items-center gap-2"><div className="h-1 w-1 rounded-full bg-primary" /> Afastamentos vigentes</li>
                  </ul>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" className="rounded-xl" onClick={() => setIsOpen(false)}>Cancelar</Button>
                  <Button className="rounded-xl gap-2" onClick={() => setCurrentStep(2)}>
                    Prosseguir <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div 
                key="step2" 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="p-4 rounded-2xl border border-border/30 bg-muted/20 space-y-3">
                  <p className="text-sm font-bold">Verbas Variáveis e Eventos</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-card rounded-xl border border-border/30">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">Horas Extras</p>
                      <p className="text-lg font-display font-bold text-success">R$ 0,00</p>
                    </div>
                    <div className="p-3 bg-card rounded-xl border border-border/30">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">Comissões</p>
                      <p className="text-lg font-display font-bold text-success">R$ 0,00</p>
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Certifique-se de que todos os lançamentos manuais foram realizados antes de calcular.
                  </p>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" className="rounded-xl" onClick={() => setCurrentStep(1)}>Voltar</Button>
                  <Button className="rounded-xl gap-2" onClick={() => setCurrentStep(3)}>
                    Iniciar Cálculo <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div 
                key="step3" 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                {!isProcessing ? (
                  <>
                    <div className="p-6 rounded-3xl bg-primary/10 mb-6">
                      <Calculator className="h-12 w-12 text-primary animate-pulse" />
                    </div>
                    <h3 className="text-lg font-display font-bold">Pronto para calcular?</h3>
                    <p className="text-sm text-muted-foreground max-w-xs mt-2 mb-8">
                      O motor de cálculo irá processar os tributos e encargos para todos os colaboradores ativos.
                    </p>
                    <div className="flex gap-3">
                      <Button variant="outline" className="rounded-xl" onClick={() => setCurrentStep(2)}>Revisar</Button>
                      <Button className="rounded-xl px-8 shadow-glow" onClick={handleCalculate}>Confirmar e Calcular</Button>
                    </div>
                  </>
                ) : (
                  <>
                    <Loader2 className="h-16 w-16 text-primary animate-spin mb-6" />
                    <h3 className="text-lg font-display font-bold text-primary">Processando Folha...</h3>
                    <div className="w-full max-w-xs bg-muted rounded-full h-1.5 mt-6 overflow-hidden">
                      <motion.div 
                        className="h-full bg-primary" 
                        initial={{ width: "0%" }} 
                        animate={{ width: "100%" }} 
                        transition={{ duration: 5 }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-4">Calculando INSS, FGTS e IRRF...</p>
                  </>
                )}
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div 
                key="step4" 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-6 text-center"
              >
                <div className="p-5 rounded-full bg-success/10 text-success mb-4">
                  <CheckCircle2 className="h-12 w-12" />
                </div>
                <h3 className="text-xl font-display font-bold">Cálculo Finalizado!</h3>
                <p className="text-sm text-muted-foreground mt-2 mb-8">
                  A folha da competência {competencia} foi encerrada com sucesso.
                </p>

                <div className="grid grid-cols-2 gap-3 w-full max-w-sm mb-6">
                  <Button variant="outline" className="rounded-xl gap-2 h-16 flex-col">
                    <Download className="h-4 w-4" />
                    <span className="text-[10px]">Relatório PDF</span>
                  </Button>
                  <Button variant="outline" className="rounded-xl gap-2 h-16 flex-col">
                    <Landmark className="h-4 w-4 text-primary" />
                    <span className="text-[10px]">Arquivo CNAB</span>
                  </Button>
                </div>

                <Button className="w-full rounded-xl" onClick={() => setIsOpen(false)}>Concluir</Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
