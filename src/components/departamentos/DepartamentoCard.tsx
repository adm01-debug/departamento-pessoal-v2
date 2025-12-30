import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

interface DepartamentoCardProps {
  nome: string;
  colaboradores: number;
  gestor?: string;
}

export function DepartamentoCard({ nome, colaboradores, gestor }: DepartamentoCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{nome}</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{colaboradores}</div>
        <p className="text-xs text-muted-foreground">
          {gestor ? `Gestor: ${gestor}` : 'Colaboradores'}
        </p>
      </CardContent>
    </Card>
  );
}
