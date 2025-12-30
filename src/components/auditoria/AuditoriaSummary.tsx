import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AuditoriaSummaryProps {
  totalActions?: number;
  todayActions?: number;
  className?: string;
}

export const AuditoriaSummary = memo(function AuditoriaSummary({ 
  totalActions = 0,
  todayActions = 0,
  className 
}: AuditoriaSummaryProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Resumo de Auditoria</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-muted rounded-lg">
          <p className="text-2xl font-bold">{totalActions}</p>
          <p className="text-sm text-muted-foreground">Total de Ações</p>
        </div>
        <div className="text-center p-4 bg-muted rounded-lg">
          <p className="text-2xl font-bold">{todayActions}</p>
          <p className="text-sm text-muted-foreground">Ações Hoje</p>
        </div>
      </CardContent>
    </Card>
  );
});

export default AuditoriaSummary;
