// V15-427
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Gift, FileText } from 'lucide-react';
const events = [{ type: 'aniversario', icon: Gift, label: 'João Silva', date: '15/01', color: 'bg-pink-100 text-pink-800' }, { type: 'ferias', icon: Calendar, label: 'Maria Santos - Férias', date: '20/01', color: 'bg-blue-100 text-blue-800' }, { type: 'vencimento', icon: FileText, label: 'ASO Vencendo (3)', date: '25/01', color: 'bg-yellow-100 text-yellow-800' }];
export function UpcomingEvents() {
  return (<Card><CardHeader><CardTitle className="text-base">Próximos Eventos</CardTitle></CardHeader><CardContent><div className="space-y-3">{events.map((e, i) => (<div key={i} className="flex items-center gap-3"><Badge className={e.color}><e.icon className="h-3 w-3" /></Badge><div className="flex-1"><p className="text-sm font-medium">{e.label}</p><p className="text-xs text-muted-foreground">{e.date}</p></div></div>))}</div></CardContent></Card>);
}
