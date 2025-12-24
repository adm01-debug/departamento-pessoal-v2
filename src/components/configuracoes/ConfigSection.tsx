/**
 * @fileoverview Seção de configuração
 * @module components/configuracoes/ConfigSection
 */
import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface ConfigSectionProps { titulo: string; descricao?: string; children: React.ReactNode; }

export const ConfigSection = memo(function ConfigSection({ titulo, descricao, children }: ConfigSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{titulo}</CardTitle>
        {descricao && <CardDescription>{descricao}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
});
