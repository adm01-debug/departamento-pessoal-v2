import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
interface NoResultsProps { query?: string; className?: string; }
export function NoResults({ query, className }: NoResultsProps) {
  return (<div className={cn('flex flex-col items-center justify-center py-16 px-4 text-center', className)}><Search className="h-12 w-12 text-muted-foreground/50 mb-4" /><h3 className="font-semibold text-lg">Nenhum resultado encontrado</h3>{query && <p className="text-muted-foreground mt-1">Não encontramos resultados para "{query}"</p>}</div>);
}
