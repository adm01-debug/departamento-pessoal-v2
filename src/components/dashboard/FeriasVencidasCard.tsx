import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export function FeriasVencidasCard() {
  return (
    <Card className="border-destructive">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Férias Vencidas</CardTitle>
        <AlertTriangle className="h-4 w-4 text-destructive" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-destructive">3</div>
        <p className="text-xs text-muted-foreground">
          Colaboradores com férias vencidas
        </p>
      </CardContent>
    </Card>
  );
}
