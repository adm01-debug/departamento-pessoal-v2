import { memo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Copy, Loader2 } from 'lucide-react';
import { useDuplicate, duplicateTransforms } from '@/hooks/useDuplicate';
import { cn } from '@/lib/utils';

interface DuplicateButtonProps<T extends Record<string, unknown>> {
  /** Registro a ser duplicado */
  record: T;
  /** Nome da tabela */
  tableName: string;
  /** Campo usado como nome/título */
  nameField?: keyof T;
  /** Campos que podem ser modificados antes de duplicar */
  editableFields?: {
    key: keyof T;
    label: string;
    type?: 'text' | 'number' | 'checkbox';
  }[];
  /** Campos a serem excluídos da duplicação */
  excludeFields?: (keyof T)[];
  /** Campos a serem resetados (zerados) */
  resetFields?: (keyof T)[];
  /** Callback após duplicação */
  onDuplicated?: (original: T, duplicate: T) => void;
  /** Query keys para invalidar */
  invalidateQueries?: string[][];
  /** Variante do botão */
  variant?: 'default' | 'outline' | 'ghost' | 'icon';
  /** Tamanho do botão */
  size?: 'default' | 'sm' | 'lg' | 'icon';
  /** Classes adicionais */
  className?: string;
  /** Desabilitado */
  disabled?: boolean;
}

export const DuplicateButton = memo(function DuplicateButton<T extends Record<string, unknown>>({
  record,
  tableName,
  nameField = 'nome' as keyof T,
  editableFields = [],
  excludeFields = ['id', 'created_at', 'updated_at'] as (keyof T)[],
  resetFields = [],
  onDuplicated,
  invalidateQueries,
  variant = 'outline',
  size = 'sm',
  className,
  disabled,
}: DuplicateButtonProps<T>) {
  const [open, setOpen] = useState(false);
  const [editedValues, setEditedValues] = useState<Partial<T>>({});

  const { duplicate, isDuplicating } = useDuplicate<T>(tableName, {
    excludeFields,
    resetFields,
    transformFields: nameField
      ? { [nameField]: duplicateTransforms.addCopySuffix } as Partial<Record<keyof T, (value: T[keyof T]) => T[keyof T]>>
      : undefined,
    onSuccess: (original, dup) => {
      setOpen(false);
      setEditedValues({});
      onDuplicated?.(original, dup);
    },
    invalidateQueries,
  });

  const handleDuplicate = () => {
    // Mesclar valores editados com o registro original
    const recordWithEdits = {
      ...record,
      ...editedValues,
    };
    duplicate(recordWithEdits);
  };

  const handleFieldChange = (key: keyof T, value: unknown) => {
    setEditedValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const getInitialValue = (key: keyof T) => {
    if (key in editedValues) return editedValues[key];
    if (key === nameField) {
      return `${record[key]} (cópia)`;
    }
    return record[key];
  };

  // Se não há campos editáveis, duplicar diretamente
  if (editableFields.length === 0) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={variant}
              size={size}
              onClick={() => duplicate(record)}
              disabled={disabled || isDuplicating}
              className={cn('gap-2', className)}
            >
              {isDuplicating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {size !== 'icon' && <span>Duplicar</span>}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Criar cópia deste registro</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Com campos editáveis, mostrar modal
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={variant}
              size={size}
              onClick={() => setOpen(true)}
              disabled={disabled || isDuplicating}
              className={cn('gap-2', className)}
            >
              {isDuplicating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {size !== 'icon' && <span>Duplicar</span>}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Criar cópia deste registro</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Copy className="h-5 w-5" />
              Duplicar Registro
            </DialogTitle>
            <DialogDescription>
              Personalize os dados da cópia antes de criar
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {editableFields.map((field) => (
              <div key={String(field.key)} className="space-y-2">
                <Label htmlFor={String(field.key)}>{field.label}</Label>

                {field.type === 'checkbox' ? (
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={String(field.key)}
                      checked={Boolean(getInitialValue(field.key))}
                      onCheckedChange={(checked) =>
                        handleFieldChange(field.key, checked)
                      }
                    />
                    <span className="text-sm text-muted-foreground">
                      {field.label}
                    </span>
                  </div>
                ) : (
                  <Input
                    id={String(field.key)}
                    type={field.type || 'text'}
                    value={String(getInitialValue(field.key) ?? '')}
                    onChange={(e) =>
                      handleFieldChange(
                        field.key,
                        field.type === 'number'
                          ? Number(e.target.value)
                          : e.target.value
                      )
                    }
                  />
                )}
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleDuplicate} disabled={isDuplicating}>
              {isDuplicating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Duplicando...
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Criar Cópia
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}) as <T extends Record<string, unknown>>(props: DuplicateButtonProps<T>) => JSX.Element;

export default DuplicateButton;
