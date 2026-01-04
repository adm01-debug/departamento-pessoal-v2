import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Filter, X, RotateCcw, Search } from "lucide-react";

interface FilterOption { value: string; label: string; }
interface FilterConfig { id: string; label: string; type: "text" | "select" | "date" | "number"; options?: FilterOption[]; placeholder?: string; }
interface TableFiltersProps { filters: FilterConfig[]; values: Record<string, any>; onChange: (values: Record<string, any>) => void; onReset?: () => void; className?: string; variant?: "inline" | "popover"; }

export function TableFilters({ filters, values, onChange, onReset, className, variant = "inline" }: TableFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const activeCount = Object.values(values).filter(v => v !== undefined && v !== "" && v !== null).length;

  const handleChange = (id: string, value: any) => onChange({ ...values, [id]: value });
  const handleReset = () => { const empty: Record<string, any> = {}; filters.forEach(f => empty[f.id] = undefined); onChange(empty); onReset?.(); };

  const renderFilter = (filter: FilterConfig) => {
    switch (filter.type) {
      case "select": return (<Select value={values[filter.id] || ""} onValueChange={v => handleChange(filter.id, v)}><SelectTrigger className="w-full"><SelectValue placeholder={filter.placeholder || "Selecione"} /></SelectTrigger><SelectContent>{filter.options?.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent></Select>);
      case "date": return <Input type="date" value={values[filter.id] || ""} onChange={e => handleChange(filter.id, e.target.value)} />;
      case "number": return <Input type="number" placeholder={filter.placeholder} value={values[filter.id] || ""} onChange={e => handleChange(filter.id, e.target.value)} />;
      default: return <Input placeholder={filter.placeholder || "Buscar..."} value={values[filter.id] || ""} onChange={e => handleChange(filter.id, e.target.value)} />;
    }
  };

  const content = (
    <div className="space-y-4">
      <div className={cn("grid gap-4", variant === "inline" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4" : "grid-cols-1")}>
        {filters.map(filter => (<div key={filter.id} className="space-y-1"><Label className="text-xs">{filter.label}</Label>{renderFilter(filter)}</div>))}
      </div>
      {activeCount > 0 && <div className="flex justify-end"><Button variant="ghost" size="sm" onClick={handleReset}><RotateCcw className="h-3 w-3 mr-1" />Limpar filtros</Button></div>}
    </div>
  );

  if (variant === "popover") {
    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild><Button variant="outline" className={className}><Filter className="h-4 w-4 mr-2" />Filtros{activeCount > 0 && <Badge variant="secondary" className="ml-2">{activeCount}</Badge>}</Button></PopoverTrigger>
        <PopoverContent className="w-80" align="end">{content}</PopoverContent>
      </Popover>
    );
  }

  return <div className={cn("p-4 border rounded-lg bg-muted/30", className)}>{content}</div>;
}
export default TableFilters;
