import { useState, useEffect } from 'react';
import { useProrrogacoesAfastamento, useAfastamentos } from '@/hooks/useAfastamentos';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, ArrowRight, History, Clock, FileText, Stethoscope } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Spinner } from '@/components/ui/spinner';
import { Separator } from '@/components/ui/separator';

interface AfastamentoTimelineProps {
  afastamentoId: string;
}

export function AfastamentoTimeline({ afastamentoId }: AfastamentoTimelineProps) {
  const { prorrogacoes, isLoading } = useProrrogacoesAfastamento();
  const { afastamentos } = useAfastamentos();
  
  const afastamento = afastamentos.find((a: any) => a.id === afastamentoId);

  if (isLoading) return <div className="flex justify-center p-8"><Spinner /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-primary font-semibold mb-2">
        <History className="h-5 w-5" />
        <h3>Linha do Tempo do Afastamento</h3>
      </div>

      <div className="relative pl-8 space-y-8 before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-0.5 before:bg-muted">
        {/* Registro Inicial */}
        <div className="relative">
          <div className="absolute -left-[25px] top-1 h-4 w-4 rounded-full border-2 border-primary bg-background flex items-center justify-center">
            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
          </div>
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="py-3 px-4 bg-muted/30">
              <div className="flex justify-between items-center">
                <Badge variant="outline" className="text-[10px] uppercase font-bold">Registro Inicial</Badge>
                {afastamento?.created_at && (
                  <span className="text-[10px] text-muted-foreground italic">
                    {format(new Date(afastamento.created_at), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="py-3 px-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold">Início</span>
                  <div className="flex items-center gap-1.5 text-sm font-medium">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    {afastamento?.data_inicio ? format(new Date(afastamento.data_inicio), 'dd/MM/yyyy') : '-'}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold">Fim Original</span>
                  <div className="flex items-center gap-1.5 text-sm font-medium">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    {afastamento?.data_fim_prevista ? format(new Date(afastamento.data_fim_prevista), 'dd/MM/yyyy') : '-'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Prorrogações */}
        {prorrogacoes.map((prorr: any, index: number) => (
          <div key={prorr.id} className="relative">
            <div className="absolute -left-[25px] top-1 h-4 w-4 rounded-full border-2 border-orange-500 bg-background flex items-center justify-center">
              <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
            </div>
            <Card className="border-orange-100 shadow-sm">
              <CardHeader className="py-3 px-4 bg-orange-50/50">
                <div className="flex justify-between items-center">
                  <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-none text-[10px] uppercase font-bold">
                    Prorrogação #{prorrogacoes.length - index}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground italic">
                    {format(new Date(prorr.created_at), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="py-3 px-4 space-y-3">
                <div className="flex items-center gap-4 justify-center py-2 bg-muted/20 rounded-lg border border-dashed">
                  <div className="text-center">
                    <p className="text-[9px] text-muted-foreground uppercase font-bold">Fim Anterior</p>
                    <p className="text-sm font-medium line-through opacity-50">
                      {prorr.data_fim_antiga ? format(new Date(prorr.data_fim_antiga), 'dd/MM/yyyy') : '-'}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-orange-400" />
                  <div className="text-center">
                    <p className="text-[9px] text-orange-600 uppercase font-bold">Novo Fim</p>
                    <p className="text-sm font-bold text-orange-700">
                      {prorr.data_fim_nova ? format(new Date(prorr.data_fim_nova), 'dd/MM/yyyy') : '-'}
                    </p>
                  </div>
                </div>

                {prorr.motivo && (
                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground uppercase font-semibold">Motivo</span>
                    <p className="text-xs text-foreground italic">"{prorr.motivo}"</p>
                  </div>
                )}
                
                <div className="flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <FileText className="h-3 w-3" />
                    <span>Doc: {prorr.documento?.nome_arquivo || 'Não vinculado'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}

        {/* Perícia Agendada (se houver) */}
        {afastamento?.data_pericia && (
          <div className="relative">
            <div className="absolute -left-[25px] top-1 h-4 w-4 rounded-full border-2 border-blue-500 bg-background flex items-center justify-center">
              <Stethoscope className="h-2.5 w-2.5 text-blue-500" />
            </div>
            <Card className="border-blue-100 bg-blue-50/20 shadow-sm">
              <CardContent className="py-4 px-4 flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <Stethoscope className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-blue-900">Perícia Médica Agendada</p>
                  <p className="text-sm font-medium text-blue-700">
                    {format(new Date(afastamento.data_pericia), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </p>
                  <p className="text-[10px] text-blue-600/80 mt-1 italic">
                    Local: {afastamento.local_pericia || 'A confirmar'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
