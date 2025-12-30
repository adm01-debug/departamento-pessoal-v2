import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AuditoriaDashboardProps {
  className?: string;
}

export const AuditoriaDashboard = memo(function AuditoriaDashboard({ className }: AuditoriaDashboardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Dashboard de Auditoria</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Visão geral da auditoria do sistema</p>
      </CardContent>
    </Card>
  );
});

export default AuditoriaDashboard;
