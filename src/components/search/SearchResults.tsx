import { cn } from '@/lib/utils';
interface SearchResultsProps<T> { results: T[]; renderItem: (item: T, index: number) => React.ReactNode; emptyMessage?: string; className?: string; }
export function SearchResults<T>({ results, renderItem, emptyMessage = 'Nenhum resultado', className }: SearchResultsProps<T>) {
  if (results.length === 0) return <p className="text-center text-muted-foreground py-8">{emptyMessage}</p>;
  return (<div className={cn('space-y-2', className)}>{results.map((item, index) => <div key={index}>{renderItem(item, index)}</div>)}</div>);
}
