import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Filter, X, Search } from "lucide-react";

interface FilterConfig { id: string; label: string; type: "text" | "select"; options?: { value: string; label: string }[]; placeholder?: string; }
interface TableFiltersProps { filters: FilterConfig[]; values: Record<string, any>; onChange: (values: Record<string, any>) => void; onClear?: () => void; className?: string; }

export function TableFilters({ filters, values, onChange, onClear, className }: TableFiltersProps) {
  const activeCount = Object.values(values).filter(v => v !== "" && v !== undefined).length;
  const handleChange = (id: string, value: any) => onChange({ ...values, [id]: value });
  const handleClear = () => { const empty: Record<string, any> = {}; filters.forEach(f => empty[f.id] = ""); onChange(empty); onClear?.(); };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative flex-1 max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input className="pl-9" placeholder="Buscar..." value={values.search || ""} onChange={e => handleChange("search", e.target.value)} /></div>
      <Popover>
        <PopoverTrigger asChild><Button variant="outline" size="sm"><Filter className="h-4 w-4 mr-2" />Filtros{activeCount > 0 && <Badge variant="secondary" className="ml-2">{activeCount}</Badge>}</Button></PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            {filters.map(filter => (
              <div key={filter.id} className="space-y-2">
                <label className="text-sm font-medium">{filter.label}</label>
                {filter.type === "select" ? (
                  <Select value={values[filter.id] || ""} onValueChange={v => handleChange(filter.id, v)}><SelectTrigger><SelectValue placeholder={filter.placeholder} /></SelectTrigger><SelectContent>{filter.options?.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent></Select>
                ) : <Input placeholder={filter.placeholder} value={values[filter.id] || ""} onChange={e => handleChange(filter.id, e.target.value)} />}
              </div>
            ))}
            {activeCount > 0 && <Button variant="ghost" size="sm" className="w-full" onClick={handleClear}><X className="h-4 w-4 mr-2" />Limpar filtros</Button>}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
export default TableFilters;
