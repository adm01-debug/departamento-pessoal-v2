import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FeriadoCalendarProps {
  ano?: number;
  mes?: number;
}

export function FeriadoCalendar({ ano, mes }: FeriadoCalendarProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Calendário de Feriados</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Calendário de feriados do ano {ano || new Date().getFullYear()}</p>
      </CardContent>
    </Card>
  );
}

export default FeriadoCalendar;
