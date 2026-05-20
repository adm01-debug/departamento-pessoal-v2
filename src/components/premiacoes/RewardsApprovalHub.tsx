import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, CheckCircle2, XCircle, Clock, User, AlertCircle } from 'lucide-react';
import { premiacoesService } from '@/services/premiacoesService';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

interface ApprovalHubProps {
  pagamentos: any[];
}

export function RewardsApprovalHub({ pagamentos }: ApprovalHubProps) {
  const queryClient = useQueryClient();

  const handleApprove = async (id: string, nextStatus: string, valor: number) => {
    try {
      await premiacoesService.atualizarStatusPagamento(id, nextStatus, valor);
      queryClient.invalidateQueries({ queryKey: ['premiacoes_pagamentos'] });
      toast.success("Aprovação registrada com sucesso.");
    } catch (e) {
      toast.error("Erro ao aprovar pagamento.");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {['calculado', 'aprovado_gestor', 'aprovado_rh'].map((stage) => (
        <Card key={stage} className="border-border/30 rounded-2xl shadow-sm">
          <CardHeader className="bg-muted/30 py-4 border-b border-border/10">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              {stage === 'calculado' ? 'Aguardando Gestor' : stage === 'aprovado_gestor' ? 'Aguardando RH' : 'Aguardando Financeiro'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {pagamentos
              .filter(p => p.status === stage)
              .map(p => (
                <div key={p.id} className="p-3 border border-border/20 rounded-xl hover:bg-muted/5">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold">{p.colaborador?.nome_completo}</span>
                    <Badge variant="outline" className="text-[10px] font-bold">R$ {p.valor_calculado}</Badge>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button 
                      size="sm" 
                      className="flex-1 h-7 text-[10px] bg-success hover:bg-success/90"
                      onClick={() => handleApprove(p.id, stage === 'calculado' ? 'aprovado_gestor' : stage === 'aprovado_gestor' ? 'aprovado_rh' : 'aprovado_financeiro', p.valor_calculado)}
                    >
                      <CheckCircle2 className="h-3 w-3 mr-1" /> Aprovar
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 text-[10px]">
                      <XCircle className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                </div>
            ))}
            {pagamentos.filter(p => p.status === stage).length === 0 && (
              <div className="text-center py-6 text-[10px] text-muted-foreground italic">Nenhum pagamento nesta etapa.</div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
