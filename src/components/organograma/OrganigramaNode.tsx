import { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
interface OrganigramaNodeProps { nome: string; cargo: string; departamento?: string; avatar?: string; }
export const OrganigramaNode = memo(function OrganigramaNode({ nome, cargo, departamento, avatar }: OrganigramaNodeProps) {
  return (
    <Card className="w-48">
      <CardContent className="p-3 text-center">
        <Avatar className="h-12 w-12 mx-auto mb-2"><AvatarFallback>{nome.slice(0,2).toUpperCase()}</AvatarFallback></Avatar>
        <p className="font-medium text-sm">{nome}</p>
        <p className="text-xs text-muted-foreground">{cargo}</p>
        {departamento && <p className="text-xs text-primary mt-1">{departamento}</p>}
      </CardContent>
    </Card>
  );
});
