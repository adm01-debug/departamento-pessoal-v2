import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  FileText, Key, Package, Send, Calculator, FileSignature,
  CheckCircle2, Clock, AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  required: boolean;
  responsible?: string;
}

interface ChecklistStage {
  id: string;
  name: string;
  icon: React.ReactNode;
  items: ChecklistItem[];
}

interface DesligamentoChecklistProps {
  onComplete?: () => void;
}

const initialChecklist: ChecklistStage[] = [
  {
    id: 'comunicacao',
    name: 'Comunicação',
    icon: <FileText className="w-4 h-4" />,
    items: [
      { id: 'carta_demissao', label: 'Carta de demissão/aviso recebida', completed: false, required: true },
      { id: 'comunicar_gestor', label: 'Gestor comunicado', completed: false, required: true },
      { id: 'comunicar_equipe', label: 'Equipe comunicada', completed: false, required: false },
      { id: 'entrevista_desligamento', label: 'Entrevista de desligamento realizada', completed: false, required: false },
    ],
  },
  {
    id: 'documentacao',
    name: 'Documentação',
    icon: <FileSignature className="w-4 h-4" />,
    items: [
      { id: 'termo_rescisao', label: 'TRCT elaborado', completed: false, required: true },
      { id: 'homologacao', label: 'Homologação agendada (se aplicável)', completed: false, required: false },
      { id: 'guia_seguro', label: 'Guia Seguro-Desemprego emitida', completed: false, required: true },
      { id: 'chave_fgts', label: 'Chave de conectividade FGTS', completed: false, required: true },
      { id: 'extrato_fgts', label: 'Extrato FGTS para conferência', completed: false, required: true },
    ],
  },
  {
    id: 'calculo',
    name: 'Cálculos e Pagamento',
    icon: <Calculator className="w-4 h-4" />,
    items: [
      { id: 'calculo_rescisao', label: 'Cálculo de rescisão finalizado', completed: false, required: true },
      { id: 'conferencia_calculo', label: 'Conferência do cálculo', completed: false, required: true },
      { id: 'aprovar_pagamento', label: 'Pagamento aprovado pelo financeiro', completed: false, required: true },
      { id: 'efetuar_pagamento', label: 'Pagamento efetuado', completed: false, required: true },
      { id: 'comprovante_pagamento', label: 'Comprovante de pagamento arquivado', completed: false, required: true },
    ],
  },
  {
    id: 'acessos',
    name: 'Revogação de Acessos',
    icon: <Key className="w-4 h-4" />,
    items: [
      { id: 'bloquear_email', label: 'E-mail corporativo bloqueado', completed: false, required: true, responsible: 'TI' },
      { id: 'bloquear_sistemas', label: 'Acesso aos sistemas revogado', completed: false, required: true, responsible: 'TI' },
      { id: 'desativar_cracha', label: 'Crachá/biometria desativado', completed: false, required: true, responsible: 'Segurança' },
      { id: 'remover_grupos', label: 'Removido de grupos e listas', completed: false, required: false, responsible: 'TI' },
    ],
  },
  {
    id: 'devolucao',
    name: 'Devolução de Bens',
    icon: <Package className="w-4 h-4" />,
    items: [
      { id: 'notebook', label: 'Notebook devolvido', completed: false, required: false, responsible: 'TI' },
      { id: 'celular', label: 'Celular corporativo devolvido', completed: false, required: false },
      { id: 'epis', label: 'EPIs devolvidos', completed: false, required: false, responsible: 'Segurança do Trabalho' },
      { id: 'uniformes', label: 'Uniformes devolvidos', completed: false, required: false },
      { id: 'chaves', label: 'Chaves/cartões de acesso', completed: false, required: false, responsible: 'Administração' },
      { id: 'estacionamento', label: 'Tag de estacionamento', completed: false, required: false },
    ],
  },
  {
    id: 'esocial',
    name: 'eSocial',
    icon: <Send className="w-4 h-4" />,
    items: [
      { id: 's2299', label: 'Evento S-2299 (Desligamento) enviado', completed: false, required: true },
      { id: 's2399', label: 'Evento S-2399 (se TSV) enviado', completed: false, required: false },
      { id: 'protocolo_esocial', label: 'Protocolo de envio salvo', completed: false, required: true },
    ],
  },
];

export function DesligamentoChecklist({ onComplete }: DesligamentoChecklistProps) {
  const [checklist, setChecklist] = useState<ChecklistStage[]>(initialChecklist);

  const toggleItem = (stageId: string, itemId: string) => {
    setChecklist(prev =>
      prev.map(stage =>
        stage.id === stageId
          ? {
              ...stage,
              items: stage.items.map(item =>
                item.id === itemId ? { ...item, completed: !item.completed } : item
              ),
            }
          : stage
      )
    );
  };

  const getStageProgress = (stage: ChecklistStage) => {
    const total = stage.items.length;
    const completed = stage.items.filter(i => i.completed).length;
    return Math.round((completed / total) * 100);
  };

  const getTotalProgress = () => {
    const allItems = checklist.flatMap(s => s.items);
    const completed = allItems.filter(i => i.completed).length;
    return Math.round((completed / allItems.length) * 100);
  };

  const getRequiredProgress = () => {
    const requiredItems = checklist.flatMap(s => s.items.filter(i => i.required));
    const completed = requiredItems.filter(i => i.completed).length;
    return Math.round((completed / requiredItems.length) * 100);
  };

  const isComplete = getTotalProgress() === 100;
  const requiredComplete = getRequiredProgress() === 100;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Checklist de Encerramento</CardTitle>
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <span className="text-muted-foreground">Obrigatórios:</span>{' '}
              <span className={cn("font-medium", requiredComplete ? "text-success" : "text-warning")}>
                {getRequiredProgress()}%
              </span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Total:</span>{' '}
              <span className="font-medium">{getTotalProgress()}%</span>
            </div>
          </div>
        </div>
        <Progress value={getTotalProgress()} className="h-2 mt-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        {checklist.map((stage) => {
          const progress = getStageProgress(stage);
          const stageRequiredItems = stage.items.filter(i => i.required);
          const stageRequiredComplete = stageRequiredItems.every(i => i.completed);

          return (
            <div
              key={stage.id}
              className={cn(
                "rounded-lg border p-4",
                progress === 100 && "border-success/50 bg-success/5"
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "p-2 rounded-full",
                    progress === 100 ? "bg-success/20 text-success" : "bg-muted text-muted-foreground"
                  )}>
                    {progress === 100 ? <CheckCircle2 className="w-4 h-4" /> : stage.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{stage.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {stage.items.filter(i => i.completed).length}/{stage.items.length} itens
                      {!stageRequiredComplete && stageRequiredItems.length > 0 && (
                        <span className="text-warning ml-2">
                          • {stageRequiredItems.filter(i => !i.completed).length} obrigatório(s) pendente(s)
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={progress} className="w-20 h-1.5" />
                  <span className="text-xs font-medium w-8">{progress}%</span>
                </div>
              </div>

              <div className="space-y-2 ml-10">
                {stage.items.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 py-1"
                  >
                    <Checkbox
                      id={item.id}
                      checked={item.completed}
                      onCheckedChange={() => toggleItem(stage.id, item.id)}
                    />
                    <label
                      htmlFor={item.id}
                      className={cn(
                        "text-sm flex-1 cursor-pointer",
                        item.completed && "text-muted-foreground line-through"
                      )}
                    >
                      {item.label}
                      {item.required && (
                        <span className="text-destructive ml-1">*</span>
                      )}
                    </label>
                    {item.responsible && (
                      <Badge variant="outline" className="text-xs">
                        {item.responsible}
                      </Badge>
                    )}
                    {!item.completed && item.required && (
                      <AlertTriangle className="w-3 h-3 text-warning" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        <Separator />

        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            <span className="text-destructive">*</span> Campos obrigatórios para finalizar o desligamento
          </p>
          <Button
            onClick={onComplete}
            disabled={!requiredComplete}
            className="gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            Concluir Desligamento
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
