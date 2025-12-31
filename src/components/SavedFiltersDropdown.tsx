import { memo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Filter, Star, Trash2, Plus, Loader2, Check } from 'lucide-react';
import { useSavedFilters, SavedFilter } from '@/hooks/useSavedFilters';
import { cn } from '@/lib/utils';

interface SavedFiltersDropdownProps {
  entityType: string;
  currentFilters: Record<string, unknown>;
  onApplyFilter: (filters: Record<string, unknown>) => void;
  className?: string;
}

export const SavedFiltersDropdown = memo(function SavedFiltersDropdown({
  entityType,
  currentFilters,
  onApplyFilter,
  className,
}: SavedFiltersDropdownProps) {
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  const {
    filters,
    isLoading,
    saveFilter,
    deleteFilter,
    setDefault,
    isSaving,
  } = useSavedFilters(entityType);

  const handleSaveFilter = () => {
    if (!filterName.trim()) return;

    saveFilter({
      name: filterName.trim(),
      filters: currentFilters,
      is_default: isDefault,
    });

    setFilterName('');
    setIsDefault(false);
    setSaveDialogOpen(false);
  };

  const handleApplyFilter = (filter: SavedFilter) => {
    onApplyFilter(filter.filters);
  };

  const hasActiveFilters = Object.keys(currentFilters).length > 0;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className={cn("gap-2", className)}
            aria-label="Filtros salvos"
          >
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filtros</span>
            {filters.length > 0 && (
              <span className="bg-primary/10 text-primary rounded-full px-1.5 py-0.5 text-xs font-medium">
                {filters.length}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          {/* Salvar filtro atual */}
          <DropdownMenuItem
            onClick={() => setSaveDialogOpen(true)}
            disabled={!hasActiveFilters}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Salvar Filtro Atual
          </DropdownMenuItem>

          {filters.length > 0 && <DropdownMenuSeparator />}

          {/* Loading */}
          {isLoading && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}

          {/* Lista de filtros */}
          {!isLoading && filters.length === 0 && (
            <div className="px-2 py-4 text-center text-sm text-muted-foreground">
              Nenhum filtro salvo
            </div>
          )}

          {!isLoading && filters.map((filter) => (
            <DropdownMenuItem
              key={filter.id}
              className="flex items-center justify-between p-2 cursor-pointer"
              onClick={() => handleApplyFilter(filter)}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {filter.is_default && (
                  <Star className="h-3 w-3 fill-yellow-500 text-yellow-500 flex-shrink-0" />
                )}
                <span className="truncate">{filter.name}</span>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDefault(filter.id);
                  }}
                  title="Definir como padrão"
                >
                  <Star className={cn(
                    "h-3 w-3",
                    filter.is_default && "fill-yellow-500 text-yellow-500"
                  )} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-destructive hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteFilter(filter.id);
                  }}
                  title="Remover filtro"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialog para salvar filtro */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Salvar Filtro</DialogTitle>
            <DialogDescription>
              Salve o filtro atual para reutilizar posteriormente.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="filter-name">Nome do Filtro</Label>
              <Input
                id="filter-name"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                placeholder="Ex: Colaboradores ativos do setor X"
                autoFocus
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant={isDefault ? "default" : "outline"}
                size="sm"
                onClick={() => setIsDefault(!isDefault)}
                className="gap-2"
              >
                {isDefault ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Star className="h-4 w-4" />
                )}
                Filtro Padrão
              </Button>
              <span className="text-xs text-muted-foreground">
                Será aplicado automaticamente ao abrir a página
              </span>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSaveFilter}
              disabled={!filterName.trim() || isSaving}
            >
              {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Salvar Filtro
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
});

export default SavedFiltersDropdown;
