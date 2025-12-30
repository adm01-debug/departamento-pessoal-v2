import { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AuditoriaLogProps {
  action?: string;
  entity?: string;
  user?: string;
  timestamp?: string;
  className?: string;
}

export const AuditoriaLog = memo(function AuditoriaLog({ 
  action = 'Ação',
  entity = 'Entidade',
  user = 'Usuário',
  timestamp,
  className 
}: AuditoriaLogProps) {
  return (
    <Card className={className}>
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Badge variant="outline">{action}</Badge>
          <span className="font-medium">{entity}</span>
        </div>
        <div className="text-sm text-muted-foreground">
          <span>{user}</span>
          {timestamp && <span className="ml-2">{timestamp}</span>}
        </div>
      </CardContent>
    </Card>
  );
});

export default AuditoriaLog;
