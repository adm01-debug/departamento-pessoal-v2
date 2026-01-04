import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Filter, X, Calendar as CalendarIcon, Search, RotateCcw } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface FilterOption { value: string; label: string; }

interface FilterConfig {
  id: string;
  label: string;
  type: "text" | "select" | "date" | "dateRange" | "multiSelect";
  options?: FilterOption[];
  placeholder?: string;
}

interface FilterValues { [key: string]: any; }

interface DashboardFilterProps {
  filters: FilterConfig[];
  values: FilterValues;
  onChange: (values: FilterValues) => void;
  onReset?: () => void;
  onApply?: () => void;
  className?: string;
  compact?: boolean;
  showActiveCount?: boolean;
}

export function DashboardFilter({
  filters, values, onChange, onReset, onApply, className, compact = false, showActiveCount = true
}: DashboardFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const activeCount = Object.values(values).filter(v => v !== undefined && v !== "" && v !== null).length;

  const handleChange = (id: string, value: any) => {
    onChange({ ...values, [id]: value });
  };

  const handleReset = () => {
    const emptyValues: FilterValues = {};
    filters.forEach(f => { emptyValues[f.id] = undefined; });
    onChange(emptyValues);
    onReset?.();
  };

  const renderFilter = (filter: FilterConfig) => {
    switch (filter.type) {
      case "select":
        return (
          <Select value={values[filter.id] || ""} onValueChange={(v) => handleChange(filter.id, v)}>
            <SelectTrigger><SelectValue placeholder={filter.placeholder || "Selecione"} /></SelectTrigger>
            <SelectContent>
              {filter.options?.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
            </SelectContent>
          </Select>
        );
      case "date":
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !values[filter.id] && "text-muted-foreground")}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {values[filter.id] ? format(values[filter.id], "PPP", { locale: ptBR }) : filter.placeholder || "Selecione data"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={values[filter.id]} onSelect={(d) => handleChange(filter.id, d)} /></PopoverContent>
          </Popover>
        );
      default:
        return (
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input className="pl-8" placeholder={filter.placeholder || "Buscar..."} value={values[filter.id] || ""} onChange={(e) => handleChange(filter.id, e.target.value)} />
          </div>
        );
    }
  };

  if (compact) {
    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className={cn("", className)}>
            <Filter className="h-4 w-4 mr-2" />Filtros
            {showActiveCount && activeCount > 0 && <Badge variant="secondary" className="ml-2">{activeCount}</Badge>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            {filters.map(filter => (
              <div key={filter.id} className="space-y-2">
                <Label>{filter.label}</Label>
                {renderFilter(filter)}
              </div>
            ))}
            <div className="flex justify-between pt-2">
              <Button variant="ghost" size="sm" onClick={handleReset}><RotateCcw className="h-4 w-4 mr-2" />Limpar</Button>
              <Button size="sm" onClick={() => { onApply?.(); setIsOpen(false); }}>Aplicar</Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="h-4 w-4" />Filtros
            {showActiveCount && activeCount > 0 && <Badge variant="secondary">{activeCount} ativos</Badge>}
          </CardTitle>
          {activeCount > 0 && <Button variant="ghost" size="sm" onClick={handleReset}><X className="h-4 w-4 mr-1" />Limpar</Button>}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filters.map(filter => (
            <div key={filter.id} className="space-y-2">
              <Label className="text-sm">{filter.label}</Label>
              {renderFilter(filter)}
            </div>
          ))}
        </div>
        {onApply && <div className="flex justify-end mt-4"><Button onClick={onApply}>Aplicar Filtros</Button></div>}
      </CardContent>
    </Card>
  );
}

export default DashboardFilter;
