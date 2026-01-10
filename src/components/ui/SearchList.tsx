import React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchListProps<T> { items: T[]; searchKey: keyof T; renderItem: (item: T) => React.ReactNode; placeholder?: string; className?: string; }

export function SearchList<T extends Record<string, any>>({ items, searchKey, renderItem, placeholder = "Buscar...", className }: SearchListProps<T>) {
  const [query, setQuery] = React.useState("");
  const filtered = items.filter((item) => String(item[searchKey]).toLowerCase().includes(query.toLowerCase()));
  return (
    <div className={cn("space-y-4", className)}>
      <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={placeholder} className="pl-10" /></div>
      <div className="space-y-2">{filtered.map((item, i) => <div key={i}>{renderItem(item)}</div>)}</div>
    </div>
  );
}
export default SearchList;
