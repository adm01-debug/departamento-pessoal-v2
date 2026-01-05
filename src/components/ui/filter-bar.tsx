import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X, Filter } from "lucide-react";
interface FilterBarProps { onSearch: (value: string) => void; onFilter?: (filters: Record<string, string>) => void; filters?: { key: string; label: string; options: { value: string; label: string }[] }[]; placeholder?: string; }
export function FilterBar({ onSearch, onFilter, filters, placeholder = "Buscar..." }: FilterBarProps) {
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const handleSearch = (value: string) => { setSearch(value); onSearch(value); };
  const handleFilter = (key: string, value: string) => { const newFilters = { ...activeFilters, [key]: value }; setActiveFilters(newFilters); onFilter?.(newFilters); };
  const clearFilters = () => { setSearch(""); setActiveFilters({}); onSearch(""); onFilter?.({}); };
  return (
    <div className="flex flex-wrap gap-3 items-center"><div className="relative flex-1 min-w-[200px]"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input value={search} onChange={e => handleSearch(e.target.value)} placeholder={placeholder} className="pl-9" /></div>{filters?.map(f => <Select key={f.key} value={activeFilters[f.key] || ""} onValueChange={v => handleFilter(f.key, v)}><SelectTrigger className="w-[150px]"><Filter className="h-4 w-4 mr-2" /><SelectValue placeholder={f.label} /></SelectTrigger><SelectContent>{f.options.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent></Select>)}{(search || Object.keys(activeFilters).length > 0) && <Button variant="ghost" size="sm" onClick={clearFilters}><X className="h-4 w-4 mr-1" />Limpar</Button>}</div>
  );
}
export default FilterBar;
