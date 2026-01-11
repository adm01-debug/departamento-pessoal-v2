// V15-488
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
interface NoResultsProps { search?: string; onClear?: () => void; }
export function NoResults({ search, onClear }: NoResultsProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Search className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium">Nenhum resultado encontrado</h3>
      {search && <p className="text-muted-foreground mt-1">Nenhum item corresponde a "{search}"</p>}
      {onClear && <Button variant="outline" className="mt-4" onClick={onClear}>Limpar busca</Button>}
    </div>
  );
}
