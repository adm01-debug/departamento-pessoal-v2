import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Palmtree } from 'lucide-react';

export function VacationCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">De Férias Hoje</CardTitle>
        <Palmtree className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">5</div>
        <p className="text-xs text-muted-foreground">
          Colaboradores em férias
        </p>
      </CardContent>
    </Card>
  );
}
