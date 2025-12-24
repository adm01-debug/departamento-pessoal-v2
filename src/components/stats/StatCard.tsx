import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
interface StatCardProps { titulo: string; valor: string | number; icone?: React.ReactNode; descricao?: string; }
export const StatCard = memo(function StatCard({ titulo, valor, icone, descricao }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">{titulo}</CardTitle>{icone}</CardHeader>
      <CardContent><p className="text-2xl font-bold">{valor}</p>{descricao && <p className="text-xs text-muted-foreground mt-1">{descricao}</p>}</CardContent>
    </Card>
  );
});
