/**
 * @fileoverview Hook para usar dialogs de confirmação
 * @module hooks/useConfirmDialog
 */
import { useState, useCallback } from 'react';

interface ConfirmOptions {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive' | 'warning' | 'info';
}

interface UseConfirmDialogReturn {
  /** Se o dialog está aberto */
  isOpen: boolean;
  /** Opções atuais do dialog */
  options: ConfirmOptions | null;
  /** Abre o dialog e retorna Promise que resolve com a resposta */
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  /** Fecha o dialog com confirmação */
  handleConfirm: () => void;
  /** Fecha o dialog com cancelamento */
  handleCancel: () => void;
  /** Controla abertura do dialog */
  setOpen: (open: boolean) => void;
}

/**
 * Hook para usar dialogs de confirmação de forma imperativa
 * @example
 * ```tsx
 * const { confirm, isOpen, options, handleConfirm, handleCancel, setOpen } = useConfirmDialog();
 * 
 * const handleDelete = async () => {
 *   const confirmed = await confirm({
 *     title: 'Excluir item?',
 *     description: 'Esta ação não pode ser desfeita.',
 *     variant: 'destructive',
 *   });
 *   if (confirmed) {
 *     // executar exclusão
 *   }
 * };
 * ```
 */
export function useConfirmDialog(): UseConfirmDialogReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [resolveRef, setResolveRef] = useState<((value: boolean) => void) | null>(null);

  const confirm = useCallback((opts: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setOptions(opts);
      setResolveRef(() => resolve);
      setIsOpen(true);
    });
  }, []);

  const handleConfirm = useCallback(() => {
    resolveRef?.(true);
    setIsOpen(false);
    setOptions(null);
  }, [resolveRef]);

  const handleCancel = useCallback(() => {
    resolveRef?.(false);
    setIsOpen(false);
    setOptions(null);
  }, [resolveRef]);

  const setOpen = useCallback((open: boolean) => {
    if (!open) {
      handleCancel();
    }
    setIsOpen(open);
  }, [handleCancel]);

  return {
    isOpen,
    options,
    confirm,
    handleConfirm,
    handleCancel,
    setOpen,
  };
}
