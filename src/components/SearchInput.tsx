import { memo, useState, useCallback, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { cn } from '@/lib/utils';

interface SearchInputProps {
  /** Valor inicial */
  value?: string;
  /** Callback quando o valor muda (com debounce) */
  onSearch: (value: string) => void;
  /** Tempo de debounce em ms (padrão: 300) */
  debounceMs?: number;
  /** Placeholder */
  placeholder?: string;
  /** Está carregando? */
  isLoading?: boolean;
  /** Classes adicionais */
  className?: string;
  /** Tamanho do input */
  size?: 'sm' | 'default' | 'lg';
  /** Mostrar botão de limpar */
  showClear?: boolean;
  /** Auto focus */
  autoFocus?: boolean;
}

export const SearchInput = memo(function SearchInput({
  value: initialValue = '',
  onSearch,
  debounceMs = 300,
  placeholder = 'Buscar...',
  isLoading = false,
  className,
  size = 'default',
  showClear = true,
  autoFocus = false,
}: SearchInputProps) {
  const [localValue, setLocalValue] = useState(initialValue);
  const debouncedValue = useDebouncedValue(localValue, debounceMs);

  // Notificar mudança com debounce
  useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  // Sincronizar com valor externo
  useEffect(() => {
    setLocalValue(initialValue);
  }, [initialValue]);

  const handleClear = useCallback(() => {
    setLocalValue('');
    onSearch('');
  }, [onSearch]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
  }, []);

  const sizeClasses = {
    sm: 'h-8 text-sm',
    default: 'h-10',
    lg: 'h-12 text-lg',
  };

  const iconSizeClasses = {
    sm: 'h-3.5 w-3.5',
    default: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  return (
    <div className={cn('relative', className)}>
      {/* Ícone de busca */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
        {isLoading ? (
          <Loader2 className={cn('animate-spin', iconSizeClasses[size])} />
        ) : (
          <Search className={iconSizeClasses[size]} />
        )}
      </div>

      {/* Input */}
      <Input
        type="search"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={cn(
          'pl-10 pr-10',
          sizeClasses[size]
        )}
      />

      {/* Botão de limpar */}
      {showClear && localValue && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleClear}
          className={cn(
            'absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground',
            size === 'sm' ? 'h-6 w-6' : size === 'lg' ? 'h-10 w-10' : 'h-8 w-8'
          )}
        >
          <X className={iconSizeClasses[size]} />
        </Button>
      )}
    </div>
  );
});

/**
 * Versão compacta para uso em toolbars
 */
export const SearchInputCompact = memo(function SearchInputCompact({
  onSearch,
  placeholder = 'Buscar',
  className,
}: {
  onSearch: (value: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <SearchInput
      onSearch={onSearch}
      placeholder={placeholder}
      size="sm"
      className={cn('w-48 lg:w-64', className)}
    />
  );
});

export default SearchInput;
