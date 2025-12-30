import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TimelineItem {
  id: string;
  acao: string;
  data: string;
  usuario: string;
}

interface DocumentoTimelineProps {
  items: TimelineItem[];
}

export function DocumentoTimeline({ items }: DocumentoTimelineProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0">
              <div className="w-2 h-2 mt-2 rounded-full bg-primary" />
              <div>
                <p className="text-sm font-medium">{item.acao}</p>
                <p className="text-xs text-muted-foreground">
                  {item.data} • {item.usuario}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
