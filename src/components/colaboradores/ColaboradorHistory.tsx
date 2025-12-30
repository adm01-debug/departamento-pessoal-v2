import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface HistoricoItem {
  id: string;
  tipo: string;
  descricao: string;
  data: string;
}

interface ColaboradorHistoryProps {
  historico?: HistoricoItem[];
  className?: string;
}

export const ColaboradorHistory = memo(function ColaboradorHistory({ 
  historico = [],
  className 
}: ColaboradorHistoryProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Histórico</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          {historico.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">Nenhum registro</p>
          ) : (
            <div className="space-y-3">
              {historico.map((item) => (
                <div key={item.id} className="border-l-2 border-primary pl-4 py-2">
                  <p className="font-medium">{item.tipo}</p>
                  <p className="text-sm text-muted-foreground">{item.descricao}</p>
                  <p className="text-xs text-muted-foreground">{item.data}</p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
});

export default ColaboradorHistory;
