import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  FileText, Key, Package, Send, Calculator, FileSignature,
  CheckCircle2, AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Desligamento } from '@/hooks/useDesligamentos';

interface DesligamentoChecklistProps {
  desligamento: Desligamento;
  onChecklistChange: (field: string, value: boolean) => void;
  onConcluir: () => void;
}

interface ChecklistItem {
  id: string;
  field: string;
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

export function DesligamentoChecklist({ desligamento, onChecklistChange, onConcluir }: DesligamentoChecklistProps) {
  const checklist: ChecklistStage[] = [
    {
      id: 'comunicacao',
      name: 'Comunicação',
      icon: <FileText className="w-4 h-4" />,
      items: [
        { id: 'comunicacao', field: 'checklist_comunicacao', label: 'Comunicação formal realizada', completed: desligamento.checklist_comunicacao, required: true },
      ],
    },
    {
      id: 'documentacao',
      name: 'Documentação',
      icon: <FileSignature className="w-4 h-4" />,
      items: [
        { id: 'documentacao', field: 'checklist_documentacao', label: 'TRCT e documentos elaborados', completed: desligamento.checklist_documentacao, required: true },
      ],
    },
    {
      id: 'calculo',
      name: 'Cálculos e Pagamento',
      icon: <Calculator className="w-4 h-4" />,
      items: [
        { id: 'calculo_rescisao', field: 'checklist_calculo_rescisao', label: 'Cálculo de rescisão conferido', completed: desligamento.checklist_calculo_rescisao, required: true },
        { id: 'homologacao', field: 'checklist_homologacao', label: 'Homologação realizada (se aplicável)', completed: desligamento.checklist_homologacao, required: false },
        { id: 'pagamento', field: 'checklist_pagamento', label: 'Pagamento efetuado', completed: desligamento.checklist_pagamento, required: true },
      ],
    },
    {
      id: 'acessos',
      name: 'Revogação de Acessos',
      icon: <Key className="w-4 h-4" />,
      items: [
        { id: 'revogacao_acessos', field: 'checklist_revogacao_acessos', label: 'Acessos aos sistemas revogados', completed: desligamento.checklist_revogacao_acessos, required: true, responsible: 'TI' },
      ],
    },
    {
      id: 'devolucao',
      name: 'Devolução de Bens',
      icon: <Package className="w-4 h-4" />,
      items: [
        { id: 'devolucao_equipamentos', field: 'checklist_devolucao_equipamentos', label: 'Equipamentos devolvidos', completed: desligamento.checklist_devolucao_equipamentos, required: false },
      ],
    },
    {
      id: 'esocial',
      name: 'eSocial',
      icon: <Send className="w-4 h-4" />,
      items: [
        { id: 'esocial', field: 'checklist_esocial', label: 'Evento S-2299 enviado ao eSocial', completed: desligamento.checklist_esocial, required: true },
      ],
    },
  ];

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
    if (requiredItems.length === 0) return 100;
    return Math.round((completed / requiredItems.length) * 100);
  };

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
                      onCheckedChange={(checked) => onChecklistChange(item.field, !!checked)}
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
            onClick={onConcluir}
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
