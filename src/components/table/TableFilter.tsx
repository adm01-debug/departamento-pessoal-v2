/**
 * @module TableFilter
 * @description Filtro de busca para tabelas
 * @category Table
 */

import React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Props do componente TableFilter
 */
interface TableFilterProps {
  /** Valor atual do filtro */
  value: string;
  /** Callback ao mudar valor */
  onChange: (value: string) => void;
  /** Placeholder */
  placeholder?: string;
  /** Debounce em ms */
  debounce?: number;
  /** Largura do input */
  width?: string | number;
  /** Classes CSS adicionais */
  className?: string;
}

/**
 * TableFilter - Filtro de tabela
 *
 * @description Input de busca para filtrar dados de tabela
 * com debounce opcional e botão de limpar
 *
 * @example
 * ```tsx
 * <TableFilter
 *   value={filter}
 *   onChange={setFilter}
 *   placeholder="Buscar por nome..."
 * />
 * ```
 */
export const TableFilter = React.memo(function TableFilter({
  value,
  onChange,
  placeholder = "Filtrar...",
  debounce = 300,
  width = 300,
  className,
}: TableFilterProps) {
  const [localValue, setLocalValue] = React.useState(value);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>(undefined);

  // Sincronizar valor externo
  React.useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Handler com debounce
  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setLocalValue(newValue);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        onChange(newValue);
      }, debounce);
    },
    [onChange, debounce]
  );

  // Limpar filtro
  const handleClear = React.useCallback(() => {
    setLocalValue("");
    onChange("");
  }, [onChange]);

  // Cleanup timeout
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const style: React.CSSProperties = {
    width: typeof width === "number" ? `${width}px` : width,
  };

  return (
    <div className={cn("relative", className)} style={style}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="pl-9 pr-9"
      />
      {localValue && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClear}
          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
});

TableFilter.displayName = "TableFilter";

export default TableFilter;
export type { TableFilterProps };
