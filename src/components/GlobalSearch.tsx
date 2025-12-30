import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, X } from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { mockColaboradores, statusColors } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const statusLabels: Record<string, string> = {
  ativo: 'Ativo',
  ferias: 'Férias',
  afastado: 'Afastado',
  desligado: 'Desligado',
  admissao: 'Em Admissão',
};

interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GlobalSearch = memo(function GlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  // Filtrar colaboradores
  const filteredColaboradores = useMemo(() => {
    if (!search) return mockColaboradores.slice(0, 8);

    const query = search.toLowerCase();
    return mockColaboradores
      .filter((c) =>
        c.nome.toLowerCase().includes(query) ||
        c.matricula.toLowerCase().includes(query) ||
        c.cargo.toLowerCase().includes(query) ||
        c.departamento.toLowerCase().includes(query)
      )
      .slice(0, 10);
  }, [search]);

  const handleSelect = useCallback((colaboradorId: string) => {
    navigate(`/colaboradores?highlight=${colaboradorId}`);
    onOpenChange(false);
    setSearch('');
  }, [navigate, onOpenChange]);

  // Keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, onOpenChange]);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput 
        placeholder="Buscar colaboradores por nome, matrícula, cargo..." 
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>
          <div className="py-6 text-center">
            <Search className="mx-auto h-8 w-8 text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">Nenhum colaborador encontrado</p>
          </div>
        </CommandEmpty>
        <CommandGroup heading={search ? `Resultados para "${search}"` : "Colaboradores recentes"}>
          {filteredColaboradores.map((colab) => {
            const colors = statusColors[colab.status];
            return (
              <CommandItem
                key={colab.id}
                value={`${colab.nome} ${colab.matricula} ${colab.cargo} ${colab.departamento}`}
                onSelect={() => handleSelect(colab.id)}
                className="flex items-center gap-3 py-3 cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <span className="text-xs font-semibold text-primary">
                    {colab.nome.split(' ').map(n => n[0]).slice(0, 2).join('')}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{colab.nome}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {colab.cargo} • {colab.departamento}
                  </p>
                </div>
                <Badge className={cn("gap-1 text-[10px] shrink-0", colors.bg, colors.text, "border-0")}>
                  {statusLabels[colab.status]}
                </Badge>
              </CommandItem>
            );
          })}
        </CommandGroup>
        <div className="px-3 py-2 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            Pressione <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">Enter</kbd> para selecionar
          </p>
        </div>
      </CommandList>
    </CommandDialog>
  );
});
