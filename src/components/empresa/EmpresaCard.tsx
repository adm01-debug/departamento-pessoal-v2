/**
 * @fileoverview Card de empresa
 * @module components/empresa/EmpresaCard
 */
import { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Edit, Users, MapPin } from 'lucide-react';

interface EmpresaCardProps {
  id: string;
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  cidade: string;
  uf: string;
  colaboradores: number;
  matriz: boolean;
  onEdit: (id: string) => void;
  onSelect?: (id: string) => void;
}

export const EmpresaCard = memo(function EmpresaCard({
  id, razaoSocial, nomeFantasia, cnpj, cidade, uf, colaboradores, matriz, onEdit, onSelect
}: EmpresaCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10"><Building2 className="h-5 w-5 text-primary" /></div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-medium truncate">{nomeFantasia || razaoSocial}</h3>
              {matriz && <Badge>Matriz</Badge>}
            </div>
            <p className="text-sm text-muted-foreground truncate">{razaoSocial}</p>
            <p className="text-xs text-muted-foreground">CNPJ: {cnpj}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{cidade}/{uf}</span>
              <span className="flex items-center gap-1"><Users className="h-3 w-3" />{colaboradores} colaboradores</span>
            </div>
          </div>
          <div className="flex gap-1">
            {onSelect && <Button size="sm" onClick={() => onSelect(id)}>Selecionar</Button>}
            <Button variant="ghost" size="icon" onClick={() => onEdit(id)}><Edit className="h-4 w-4" /></Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
