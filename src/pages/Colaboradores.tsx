import { useState } from 'react';
import { Search, Filter, Plus, MoreVertical } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockColaboradores, statusColors } from '@/data/mockData';
import { cn } from '@/lib/utils';

const statusLabels: Record<string, string> = {
  ativo: 'Ativo',
  ferias: 'Férias',
  afastado: 'Afastado',
  desligado: 'Desligado',
  admissao: 'Em Admissão',
};

export default function Colaboradores() {
  const [search, setSearch] = useState('');

  const filteredColaboradores = mockColaboradores.filter(c => 
    c.nome.toLowerCase().includes(search.toLowerCase()) ||
    c.matricula.toLowerCase().includes(search.toLowerCase()) ||
    c.cargo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Colaboradores</h1>
          <p className="text-muted-foreground text-sm">Gestão do cadastro de colaboradores</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Colaborador
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar por nome, matrícula, cargo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          Filtros
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Colaborador</th>
              <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Matrícula</th>
              <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Cargo</th>
              <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Departamento</th>
              <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
              <th className="text-right p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredColaboradores.map((colab) => {
              const colors = statusColors[colab.status];
              return (
                <tr key={colab.id} className="hover:bg-muted/30 transition-colors cursor-pointer">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">
                          {colab.nome.split(' ').map(n => n[0]).slice(0, 2).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{colab.nome}</p>
                        <p className="text-xs text-muted-foreground">Desde {new Date(colab.dataAdmissao).toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-foreground font-mono">{colab.matricula}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-foreground">{colab.cargo}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-muted-foreground">{colab.departamento}</span>
                  </td>
                  <td className="p-4">
                    <Badge className={cn("gap-1.5", colors.bg, colors.text, "border-0")}>
                      <span className={cn("w-1.5 h-1.5 rounded-full", colors.dot)} />
                      {statusLabels[colab.status]}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Mostrando 1-{filteredColaboradores.length} de {mockColaboradores.length} colaboradores
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>Anterior</Button>
          <Button variant="outline" size="sm" disabled>Próximo</Button>
        </div>
      </div>
    </div>
  );
}
