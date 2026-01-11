// V15-339
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
interface FormModalProps { open: boolean; onOpenChange: (open: boolean) => void; title: string; description?: string; children: React.ReactNode; onSubmit: () => void; submitText?: string; loading?: boolean; }
export function FormModal({ open, onOpenChange, title, description, children, onSubmit, submitText = 'Salvar', loading = false }: FormModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]"><DialogHeader><DialogTitle>{title}</DialogTitle>{description && <DialogDescription>{description}</DialogDescription>}</DialogHeader>
        <div className="py-4">{children}</div>
        <DialogFooter><Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button><Button onClick={onSubmit} disabled={loading}>{loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}{submitText}</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
