// V15-508
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
const feriasAgendadas = [new Date(2025, 0, 20), new Date(2025, 0, 21), new Date(2025, 0, 22), new Date(2025, 1, 10), new Date(2025, 1, 11)];
export function FeriasCalendario() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  return (
    <Card><CardHeader><CardTitle>Calendário de Férias</CardTitle></CardHeader><CardContent>
      <Calendar mode="single" selected={date} onSelect={setDate} modifiers={{ ferias: feriasAgendadas }} modifiersStyles={{ ferias: { backgroundColor: '#dbeafe', color: '#1e40af' } }} className="rounded-md border" />
      <div className="mt-4 flex items-center gap-2"><Badge className="bg-blue-100 text-blue-800">Férias Agendadas</Badge><span className="text-sm text-muted-foreground">{feriasAgendadas.length} dias</span></div>
    </CardContent></Card>
  );
}
