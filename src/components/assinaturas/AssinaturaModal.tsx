import { memo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AssinaturaCanvas } from './AssinaturaCanvas';

interface AssinaturaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (assinatura: string) => void;
  titulo?: string;
}

export const AssinaturaModal = memo(function AssinaturaModal({
  open,
  onOpenChange,
  onSave,
  titulo = 'Assinar Documento'
}: AssinaturaModalProps) {
  const [assinatura, setAssinatura] = useState<string | null>(null);

  const handleSave = () => {
    if (assinatura && onSave) {
      onSave(assinatura);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{titulo}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Desenhe sua assinatura no campo abaixo
          </p>
          <AssinaturaCanvas onSave={setAssinatura} />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={!assinatura}>
              Confirmar Assinatura
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});

export default AssinaturaModal;
