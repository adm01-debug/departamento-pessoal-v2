/**
 * @fileoverview Ações rápidas do dashboard
 * @module components/dashboard/QuickActions
 */
import { memo } from 'react';
import { Plus, UserPlus, FileText, Calendar, Clock, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface QuickAction {
  id: string;
  label: string;
  icon: typeof Plus;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'ghost';
}

interface QuickActionsProps {
  /** Lista de ações rápidas */
  actions?: QuickAction[];
  /** Callback para ação padrão */
  onAction?: (actionId: string) => void;
}

const defaultActions: Omit<QuickAction, 'onClick'>[] = [
  { id: 'admissao', label: 'Nova Admissão', icon: UserPlus },
  { id: 'ferias', label: 'Solicitar Férias', icon: Calendar },
  { id: 'ponto', label: 'Registrar Ponto', icon: Clock },
  { id: 'documento', label: 'Upload Documento', icon: FileText },
  { id: 'folha', label: 'Calcular Folha', icon: DollarSign },
];

/**
 * Componente de ações rápidas para operações comuns
 */
export const QuickActions = memo(function QuickActions({ actions, onAction }: QuickActionsProps) {
  const items = actions || defaultActions.map(a => ({ ...a, onClick: () => onAction?.(a.id) }));
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Plus className="h-4 w-4 text-primary" />
          Ações Rápidas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {items.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.id}
                variant={action.variant || 'outline'}
                className="h-auto py-3 flex flex-col items-center gap-2"
                onClick={action.onClick}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs">{action.label}</span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
});

