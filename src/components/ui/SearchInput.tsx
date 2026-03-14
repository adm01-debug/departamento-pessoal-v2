import React, { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Loader2, History, TrendingUp } from "lucide-react";

interface SearchSuggestion {
  id: string;
  text: string;
  type?: "history" | "suggestion" | "trending";
}

interface SearchInputProps {
  className?: string;
  placeholder?: string;
  value?: string;
  suggestions?: SearchSuggestion[];
  recentSearches?: string[];
  isLoading?: boolean;
  debounceMs?: number;
  onSearch?: (query: string) => void;
  onChange?: (value: string) => void;
  onSuggestionSelect?: (suggestion: SearchSuggestion) => void;
  onClear?: () => void;
}

export function SearchInput({ className, placeholder = "Buscar...", value: controlledValue, suggestions = [], recentSearches = [], isLoading = false, debounceMs = 300, onSearch, onChange, onSuggestionSelect, onClear }: SearchInputProps) {
  const [value, setValue] = useState(controlledValue || "");
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (controlledValue !== undefined) setValue(controlledValue);
  }, [controlledValue]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onChange?.(newValue);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => { if (newValue.length >= 2) onSearch?.(newValue); }, debounceMs);
  }, [onChange, onSearch, debounceMs]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) onSearch?.(value.trim());
    setShowSuggestions(false);
  };

  const handleClear = () => {
    setValue("");
    onChange?.("");
    onClear?.();
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setValue(suggestion.text);
    onSuggestionSelect?.(suggestion);
    setShowSuggestions(false);
  };

  const allSuggestions: SearchSuggestion[] = [
    ...recentSearches.map((text, i) => ({ id: `history-${i}`, text, type: "history" as const })),
    ...suggestions
  ];

  const getIcon = (type?: string) => {
    switch (type) {
      case "history": return <History className="h-4 w-4 text-muted-foreground" />;
      case "trending": return <TrendingUp className="h-4 w-4 text-muted-foreground" />;
      default: return <Search className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className={cn("relative", className)}>
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input ref={inputRef} value={value} onChange={handleChange} onFocus={() => { setIsFocused(true); setShowSuggestions(true); }} onBlur={() => { setIsFocused(false); setTimeout(() => setShowSuggestions(false), 200); }} placeholder={placeholder} className="pl-10 pr-20" />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          {value && <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={handleClear}><X className="h-4 w-4" /></Button>}
          <Button type="submit" variant="ghost" size="icon" className="h-6 w-6"><Search className="h-4 w-4" /></Button>
        </div>
      </form>
      {showSuggestions && allSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-lg shadow-lg z-50 max-h-60 overflow-auto">
          {allSuggestions.map(suggestion => (
            <button key={suggestion.id} type="button" onClick={() => handleSuggestionClick(suggestion)} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-accent">
              {getIcon(suggestion.type)}
              <span>{suggestion.text}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
export default SearchInput;
