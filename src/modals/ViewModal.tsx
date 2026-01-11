// V15-340
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
interface ViewModalProps { open: boolean; onOpenChange: (open: boolean) => void; title: string; description?: string; children: React.ReactNode; size?: 'sm' | 'md' | 'lg' | 'xl'; }
const sizeClasses = { sm: 'sm:max-w-[400px]', md: 'sm:max-w-[500px]', lg: 'sm:max-w-[700px]', xl: 'sm:max-w-[900px]' };
export function ViewModal({ open, onOpenChange, title, description, children, size = 'md' }: ViewModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={sizeClasses[size]}><DialogHeader><DialogTitle>{title}</DialogTitle>{description && <DialogDescription>{description}</DialogDescription>}</DialogHeader>
        <div className="py-4">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
