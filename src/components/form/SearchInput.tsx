import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
interface SearchInputProps { value?: string; onChange?: (value: string) => void; onSearch?: (value: string) => void; placeholder?: string; debounce?: number; className?: string; }
export function SearchInput({ value: controlledValue, onChange, onSearch, placeholder = 'Buscar...', debounce = 300, className }: SearchInputProps) {
  const [value, setValue] = useState(controlledValue || '');
  const timeoutRef = useRef<NodeJS.Timeout>();
  useEffect(() => { if (controlledValue !== undefined) setValue(controlledValue); }, [controlledValue]);
  const handleChange = (v: string) => { setValue(v); onChange?.(v); if (timeoutRef.current) clearTimeout(timeoutRef.current); timeoutRef.current = setTimeout(() => onSearch?.(v), debounce); };
  const handleClear = () => { setValue(''); onChange?.(''); onSearch?.(''); };
  return (<div className={cn('relative', className)}><Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder={placeholder} value={value} onChange={e => handleChange(e.target.value)} className="pl-8 pr-8" />{value && <Button variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-2" onClick={handleClear}><X className="h-4 w-4" /></Button>}</div>);
}
