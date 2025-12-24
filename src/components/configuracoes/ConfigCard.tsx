/**
 * @fileoverview Card de configuração
 * @module components/configuracoes/ConfigCard
 */
import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

interface ConfigCardProps { titulo: string; descricao: string; icone: React.ReactNode; onClick: () => void; }

export const ConfigCard = memo(function ConfigCard({ titulo, descricao, icone, onClick }: ConfigCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <CardHeader className="flex-row items-center gap-4">
        <div className="p-2 rounded-lg bg-primary/10">{icone}</div>
        <div className="flex-1">
          <CardTitle className="text-base">{titulo}</CardTitle>
          <CardDescription>{descricao}</CardDescription>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
    </Card>
  );
});
