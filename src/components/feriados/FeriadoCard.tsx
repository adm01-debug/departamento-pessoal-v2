/**
 * @fileoverview Card de feriado
 * @module components/feriados/FeriadoCard
 */
import { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Edit, Trash2, MapPin } from 'lucide-react';

interface FeriadoCardProps {
  id: string;
  nome: string;
  data: string;
  tipo: 'nacional' | 'estadual' | 'municipal' | 'facultativo';
  recorrente: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const tipoConfig = {
  nacional: { label: 'Nacional', variant: 'default' as const },
  estadual: { label: 'Estadual', variant: 'secondary' as const },
  municipal: { label: 'Municipal', variant: 'outline' as const },
  facultativo: { label: 'Facultativo', variant: 'outline' as const },
};

/**
 * Card de exibição de feriado
 */
export const FeriadoCard = memo(function FeriadoCard({
  id, nome, data, tipo, recorrente, onEdit, onDelete
}: FeriadoCardProps) {
  const config = tipoConfig[tipo];
  const dataFormatada = new Date(data + 'T00:00:00').toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'long'
  });

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">{nome}</h3>
              <p className="text-sm text-muted-foreground">{dataFormatada}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={config.variant}>{config.label}</Badge>
                {recorrente && <Badge variant="outline">Recorrente</Badge>}
              </div>
            </div>
          </div>
          <div className="flex gap-1">
            {onEdit && (
              <Button variant="ghost" size="icon" onClick={() => onEdit(id)}>
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button variant="ghost" size="icon" onClick={() => onDelete(id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
