/**
 * @fileoverview Card de relatório
 * @module components/relatorios/RelatorioCard
 */
import { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Eye, Calendar } from 'lucide-react';

interface RelatorioCardProps {
  id: string;
  titulo: string;
  descricao: string;
  categoria: string;
  ultimaGeracao?: string;
  onGerar: (id: string) => void;
  onVisualizar?: (id: string) => void;
}

export const RelatorioCard = memo(function RelatorioCard({
  id, titulo, descricao, categoria, ultimaGeracao, onGerar, onVisualizar
}: RelatorioCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10"><FileText className="h-5 w-5 text-primary" /></div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium">{titulo}</h3>
                <p className="text-sm text-muted-foreground">{descricao}</p>
              </div>
              <Badge variant="outline">{categoria}</Badge>
            </div>
            {ultimaGeracao && (
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <Calendar className="h-3 w-3" />Última geração: {new Date(ultimaGeracao).toLocaleDateString('pt-BR')}
              </p>
            )}
            <div className="flex gap-2 mt-3">
              <Button size="sm" onClick={() => onGerar(id)}><Download className="h-4 w-4 mr-1" />Gerar</Button>
              {onVisualizar && ultimaGeracao && <Button size="sm" variant="outline" onClick={() => onVisualizar(id)}><Eye className="h-4 w-4 mr-1" />Ver Último</Button>}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
