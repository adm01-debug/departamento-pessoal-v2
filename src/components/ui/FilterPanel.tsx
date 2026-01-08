import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Filter, X, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface FilterConfig {
  key: string;
  label: string;
  type: "text" | "select" | "multiselect" | "range" | "checkbox" | "date";
  options?: FilterOption[];
  min?: number;
  max?: number;
  placeholder?: string;
}

interface FilterPanelProps {
  filters: FilterConfig[];
  className?: string;
  values?: Record<string, any>;
  collapsible?: boolean;
  onFilterChange?: (key: string, value: any) => void;
  onReset?: () => void;
  onApply?: (values: Record<string, any>) => void;
}

export function FilterPanel({ filters, className, values: controlledValues = {}, collapsible = false, onFilterChange, onReset, onApply }: FilterPanelProps) {
  const [localValues, setLocalValues] = useState<Record<string, any>>(controlledValues);
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(filters.map(f => f.key)));

  const values = controlledValues || localValues;

  const handleChange = (key: string, value: any) => {
    const newValues = { ...values, [key]: value };
    setLocalValues(newValues);
    onFilterChange?.(key, value);
  };

  const handleReset = () => {
    setLocalValues({});
    onReset?.();
  };

  const activeFilterCount = Object.values(values).filter(v => v !== undefined && v !== "" && v !== null && (Array.isArray(v) ? v.length > 0 : true)).length;

  const toggleSection = (key: string) => {
    const newOpen = new Set(openSections);
    if (newOpen.has(key)) newOpen.delete(key);
    else newOpen.add(key);
    setOpenSections(newOpen);
  };

  const renderFilter = (filter: FilterConfig) => {
    const value = values[filter.key];

    switch (filter.type) {
      case "text":
        return <Input placeholder={filter.placeholder} value={value || ""} onChange={(e) => handleChange(filter.key, e.target.value)} />;
      case "select":
        return (
          <Select value={value || ""} onValueChange={(v) => handleChange(filter.key, v)}>
            <SelectTrigger><SelectValue placeholder={filter.placeholder || "Selecione..."} /></SelectTrigger>
            <SelectContent>{filter.options?.map(opt => (<SelectItem key={opt.value} value={opt.value}>{opt.label}{opt.count !== undefined && ` (${opt.count})`}</SelectItem>))}</SelectContent>
          </Select>
        );
      case "multiselect":
        return (
          <div className="space-y-2">
            {filter.options?.map(opt => (
              <div key={opt.value} className="flex items-center gap-2">
                <Checkbox id={`${filter.key}-${opt.value}`} checked={(value || []).includes(opt.value)} onCheckedChange={(checked) => {
                  const current = value || [];
                  const newValue = checked ? [...current, opt.value] : current.filter((v: string) => v !== opt.value);
                  handleChange(filter.key, newValue);
                }} />
                <Label htmlFor={`${filter.key}-${opt.value}`} className="text-sm cursor-pointer">{opt.label}{opt.count !== undefined && <span className="text-muted-foreground ml-1">({opt.count})</span>}</Label>
              </div>
            ))}
          </div>
        );
      case "range":
        return (
          <div className="space-y-2">
            <Slider value={value || [filter.min || 0, filter.max || 100]} min={filter.min || 0} max={filter.max || 100} step={1} onValueChange={(v) => handleChange(filter.key, v)} />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{value?.[0] || filter.min || 0}</span>
              <span>{value?.[1] || filter.max || 100}</span>
            </div>
          </div>
        );
      case "checkbox":
        return <Checkbox checked={value || false} onCheckedChange={(checked) => handleChange(filter.key, checked)} />;
      case "date":
        return <Input type="date" value={value || ""} onChange={(e) => handleChange(filter.key, e.target.value)} />;
      default:
        return null;
    }
  };

  const FilterContent = () => (
    <div className="space-y-4">
      {filters.map(filter => (
        collapsible ? (
          <Collapsible key={filter.key} open={openSections.has(filter.key)}>
            <CollapsibleTrigger className="flex items-center justify-between w-full py-2" onClick={() => toggleSection(filter.key)}>
              <span className="text-sm font-medium">{filter.label}</span>
              {openSections.has(filter.key) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2">{renderFilter(filter)}</CollapsibleContent>
          </Collapsible>
        ) : (
          <div key={filter.key} className="space-y-2">
            <Label className="text-sm font-medium">{filter.label}</Label>
            {renderFilter(filter)}
          </div>
        )
      ))}
    </div>
  );

  return (
    <div className={cn("p-4 bg-card border rounded-lg", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span className="font-medium">Filtros</span>
          {activeFilterCount > 0 && <Badge variant="secondary">{activeFilterCount}</Badge>}
        </div>
        <Button variant="ghost" size="sm" onClick={handleReset}><RotateCcw className="h-4 w-4 mr-1" />Limpar</Button>
      </div>
      <FilterContent />
      {onApply && (
        <Button className="w-full mt-4" onClick={() => onApply(values)}>Aplicar Filtros</Button>
      )}
    </div>
  );
}
export default FilterPanel;
