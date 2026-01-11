// V15-428
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Info, AlertCircle } from 'lucide-react';
const alerts = [{ type: 'warning', icon: AlertTriangle, message: 'Férias vencendo em 30 dias: 5 colaboradores' }, { type: 'info', icon: Info, message: 'Folha de Janeiro aguardando fechamento' }, { type: 'error', icon: AlertCircle, message: 'Evento eSocial S-1200 com erro' }];
const alertStyles = { warning: 'border-yellow-500 bg-yellow-50', info: 'border-blue-500 bg-blue-50', error: 'border-red-500 bg-red-50' };
export function AlertsWidget() {
  return (<Card><CardHeader><CardTitle className="text-base">Alertas</CardTitle></CardHeader><CardContent className="space-y-2">{alerts.map((a, i) => (<Alert key={i} className={alertStyles[a.type as keyof typeof alertStyles]}><a.icon className="h-4 w-4" /><AlertDescription className="text-sm">{a.message}</AlertDescription></Alert>))}</CardContent></Card>);
}
