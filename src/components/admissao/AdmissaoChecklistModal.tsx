import { memo } from 'react';
import { useState, memo, memo, memo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  User, FileText, Stethoscope, FileSignature, Send, BookOpen, 
  CheckCircle2, Clock, AlertTriangle, ChevronRight, Pencil, Link
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  required: boolean;
  observation?: string;
}

interface ChecklistStage {
  id: string;
  name: string;
  icon: React.ReactNode;
  items: ChecklistItem[];
}

interface AdmissaoChecklistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  admissao: {
    id: string;
    candidatoNome: string;
    cargo: string;
    departamento: string;
    etapa: string;
    progresso: number;
    dataPrevisao: string;
    cpf?: string | null;
    data_nascimento?: string | null;
    sexo?: string | null;
    nome_mae?: string | null;
  } | null;
  onAdvanceStage?: () => void;
  onConvertToColaborador?: () => void;
  onEdit?: () => void;
  onOpenContratacaoDigital?: () => void;
}

const initialChecklist: ChecklistStage[] = [
  {
    id: 'documentos',
    name: 'Coleta de Documentos',
    icon: <FileText className="w-4 h-4" />,
    items: [
      { id: 'rg', label: 'RG (Cópia)', completed: true, required: true },
      { id: 'cpf', label: 'CPF (Cópia)', completed: true, required: true },
      { id: 'ctps', label: 'CTPS Digital', completed: true, required: true },
      { id: 'pis', label: 'Cartão PIS/PASEP', completed: false, required: true },
      { id: 'comprovante_residencia', label: 'Comprovante de Residência', completed: true, required: true },
      { id: 'titulo_eleitor', label: 'Título de Eleitor', completed: false, required: false },
      { id: 'certificado_reservista', label: 'Certificado Reservista (se homem)', completed: false, required: false },
      { id: 'certidao_nascimento', label: 'Certidão de Nascimento/Casamento', completed: false, required: true },
      { id: 'foto_3x4', label: 'Foto 3x4', completed: true, required: true },
      { id: 'dados_bancarios', label: 'Dados Bancários', completed: false, required: true },
    ],
  },
  {
    id: 'validacao',
    name: 'Validação',
    icon: <CheckCircle2 className="w-4 h-4" />,
    items: [
      { id: 'validar_docs', label: 'Documentos validados pelo DP', completed: false, required: true },
      { id: 'consulta_cpf', label: 'Consulta situação CPF', completed: false, required: true },
      { id: 'referencias', label: 'Verificação de referências', completed: false, required: false },
      { id: 'antecedentes', label: 'Certidão de antecedentes', completed: false, required: false },
    ],
  },
  {
    id: 'exame',
    name: 'Exame Admissional',
    icon: <Stethoscope className="w-4 h-4" />,
    items: [
      { id: 'agendar_aso', label: 'ASO agendado', completed: false, required: true },
      { id: 'aso_realizado', label: 'ASO realizado', completed: false, required: true },
      { id: 'aso_apto', label: 'Resultado: Apto', completed: false, required: true },
    ],
  },
  {
    id: 'contrato',
    name: 'Contrato',
    icon: <FileSignature className="w-4 h-4" />,
    items: [
      { id: 'gerar_contrato', label: 'Contrato gerado', completed: false, required: true },
      { id: 'revisar_contrato', label: 'Contrato revisado pelo jurídico', completed: false, required: false },
      { id: 'assinar_contrato', label: 'Contrato assinado', completed: false, required: true },
      { id: 'ficha_registro', label: 'Ficha de registro preenchida', completed: false, required: true },
    ],
  },
  {
    id: 'esocial',
    name: 'eSocial',
    icon: <Send className="w-4 h-4" />,
    items: [
      { id: 'cadastrar_esocial', label: 'Cadastro no eSocial', completed: false, required: true },
      { id: 's2200', label: 'Evento S-2200 enviado', completed: false, required: true },
      { id: 'protocolo', label: 'Protocolo de envio salvo', completed: false, required: true },
    ],
  },
  {
    id: 'onboarding',
    name: 'Onboarding',
    icon: <BookOpen className="w-4 h-4" />,
    items: [
      { id: 'criar_email', label: 'E-mail corporativo criado', completed: false, required: false },
      { id: 'criar_acessos', label: 'Acessos aos sistemas', completed: false, required: false },
      { id: 'entrega_epi', label: 'EPIs entregues (se aplicável)', completed: false, required: false },
      { id: 'kit_boas_vindas', label: 'Kit boas-vindas entregue', completed: false, required: false },
      { id: 'treinamento_inicial', label: 'Treinamento inicial realizado', completed: false, required: true },
    ],
  },
];

export const AdmissaoChecklistModal = memo(function AdmissaoChecklistModal({
  open,
  onOpenChange,
  admissao,
  onAdvanceStage,
  onConvertToColaborador,
  onEdit,
  onOpenContratacaoDigital,
}: AdmissaoChecklistModalProps) {
  const [checklist, setChecklist] = useState<ChecklistStage[]>(initialChecklist);

  if (!admissao) return null;

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

  const canAdvance = () => {
    const currentStageIndex = checklist.findIndex(s => s.name === admissao.etapa);
    if (currentStageIndex === -1) return true;
    const currentStage = checklist[currentStageIndex];
    return currentStage.items.filter(i => i.required).every(i => i.completed);
  };

  const isDadosPessoaisIncompletos = () => {
    return !admissao.cpf || !admissao.data_nascimento || !admissao.sexo || !admissao.nome_mae;
  };

  const getCamposFaltantes = (): string[] => {
    const campos: string[] = [];
    if (!admissao.cpf) campos.push('CPF');
    if (!admissao.data_nascimento) campos.push('Data de Nascimento');
    if (!admissao.sexo) campos.push('Sexo');
    if (!admissao.nome_mae) campos.push('Nome da Mãe');
    return campos;
  };

  const isComplete = getTotalProgress() === 100;
  const dadosIncompletos = isDadosPessoaisIncompletos();
  const camposFaltantes = getCamposFaltantes();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-semibold">{admissao.candidatoNome}</div>
                <div className="text-sm font-normal text-muted-foreground">
                  {admissao.cargo} • {admissao.departamento}
                </div>
              </div>
            </div>
            {onEdit && (
              <Button variant="outline" size="sm" onClick={onEdit} className="gap-2">
                <Pencil className="w-4 h-4" />
                Editar Dados
              </Button>
            )}
            {onOpenContratacaoDigital && (
              <Button variant="outline" size="sm" onClick={onOpenContratacaoDigital} className="gap-2 ml-2">
                <Link className="w-4 h-4" />
                Link Digital
              </Button>
            )}
          </DialogTitle>
        </DialogHeader>

        {/* Progress Overview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progresso Geral</span>
            <span className="font-medium">{getTotalProgress()}%</span>
          </div>
          <Progress value={getTotalProgress()} className="h-2" />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Previsão: {new Date(admissao.dataPrevisao).toLocaleDateString('pt-BR')}</span>
            <Badge variant={admissao.etapa === 'Concluído' ? 'default' : 'secondary'}>
              {admissao.etapa}
            </Badge>
          </div>
        </div>

        <Separator />

        {/* Checklist Stages */}
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {checklist.map((stage, stageIndex) => {
              const progress = getStageProgress(stage);
              const isCurrentStage = stage.name === admissao.etapa || 
                (admissao.etapa === 'Solicitação Recebida' && stageIndex === 0);
              
              return (
                <div
                  key={stage.id}
                  className={cn(
                    "rounded-lg border p-4",
                    isCurrentStage && "border-primary bg-primary/5"
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
                        {!item.completed && item.required && (
                          <AlertTriangle className="w-3 h-3 text-warning" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        <Separator />

        {/* Actions */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            <span className="text-destructive">*</span> Campos obrigatórios
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
            {isComplete ? (
              dadosIncompletos ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <Button disabled className="gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          Criar Colaborador
                        </Button>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="font-medium mb-1">Dados pessoais incompletos:</p>
                      <ul className="text-xs list-disc pl-4">
                        {camposFaltantes.map(campo => (
                          <li key={campo}>{campo}</li>
                        ))}
                      </ul>
                      <p className="text-xs mt-2 text-muted-foreground">
                        Clique em "Editar Dados" para completar.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <Button onClick={onConvertToColaborador} className="gap-2">
                  <User className="w-4 h-4" />
                  Criar Colaborador
                </Button>
              )
            ) : (
              <Button
                onClick={onAdvanceStage}
                disabled={!canAdvance()}
                className="gap-2"
              >
                Avançar Etapa
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});