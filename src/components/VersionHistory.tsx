import { memo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

interface VersionHistoryProps {
  entityType: string;
  entityId: string;
  trigger: React.ReactNode;
}

export const VersionHistory = memo(function VersionHistory({
  entityType,
  entityId,
  trigger,
}: VersionHistoryProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Histórico de Versões
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[400px]">
          <div className="space-y-3 p-1">
            <div className="text-sm text-muted-foreground text-center py-8">
              Nenhuma versão anterior encontrada para {entityType}/{entityId}.
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
});
