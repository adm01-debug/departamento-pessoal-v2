/**
 * @fileoverview Diálogo de confirmação reutilizável
 * @module components/common/ConfirmationDialog
 */
import { memo, type ReactNode } from 'react';
import { AlertTriangle, Info, CheckCircle, XCircle, type LucideIcon } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';

type Variant = 'default' | 'destructive' | 'warning' | 'success';

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string | ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  variant?: Variant;
  loading?: boolean;
}

const variantConfig: Record<Variant, { icon: LucideIcon; iconClass: string; buttonClass: string }> = {
  default: { icon: Info, iconClass: 'text-primary', buttonClass: '' },
  destructive: { icon: XCircle, iconClass: 'text-destructive', buttonClass: 'bg-destructive hover:bg-destructive/90' },
  warning: { icon: AlertTriangle, iconClass: 'text-yellow-500', buttonClass: 'bg-yellow-500 hover:bg-yellow-600' },
  success: { icon: CheckCircle, iconClass: 'text-green-500', buttonClass: 'bg-green-500 hover:bg-green-600' },
};

export const ConfirmationDialog = memo(function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  variant = 'default',
  loading = false,
}: ConfirmationDialogProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  const handleConfirm = () => {
    onConfirm();
    if (!loading) onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className={cn('rounded-full p-2 bg-muted')}>
              <Icon className={cn('h-5 w-5', config.iconClass)} />
            </div>
            <AlertDialogTitle>{title}</AlertDialogTitle>
          </div>
          {description && <AlertDialogDescription className="mt-2">{description}</AlertDialogDescription>}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel} disabled={loading}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={loading} className={config.buttonClass}>
            {loading ? 'Processando...' : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
});
