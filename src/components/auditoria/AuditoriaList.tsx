import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AuditoriaListProps {
  items?: Array<{ id: string; action: string; timestamp: string }>;
  className?: string;
}

export const AuditoriaList = memo(function AuditoriaList({ items = [], className }: AuditoriaListProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Registros de Auditoria</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          {items.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Nenhum registro encontrado</p>
          ) : (
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="p-3 border rounded-lg">
                  <p className="font-medium">{item.action}</p>
                  <p className="text-sm text-muted-foreground">{item.timestamp}</p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
});

export default AuditoriaList;
