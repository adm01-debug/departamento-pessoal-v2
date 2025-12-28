import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface PendenciaAlertProps {
  alerts?: Array<{ id: string; message: string; type: string }>;
  onDismiss?: (id: string) => void;
}

export function PendenciaAlert({ alerts = [], onDismiss }: PendenciaAlertProps) {
  if (alerts.length === 0) return null;
  
  return (
    <div className="space-y-2">
      {alerts.map(alert => (
        <Alert key={alert.id} variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Atenção</AlertTitle>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      ))}
    </div>
  );
}

export default PendenciaAlert;
