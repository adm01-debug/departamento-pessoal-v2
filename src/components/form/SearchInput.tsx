import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value?: string;
  onSearch?: (value: string) => void;
  onClear?: () => void;
  showClear?: boolean;
  className?: string;
}

export function SearchInput({ value = "", onSearch, onClear, showClear = true, className, ...props }: SearchInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => onSearch?.(e.target.value);
  const handleClear = () => { onSearch?.(""); onClear?.(); };
  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === "Escape") handleClear(); };
  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input {...props} value={value} onChange={handleChange} onKeyDown={handleKeyDown} className="pl-9 pr-9" />
      {showClear && value && (
        <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full" onClick={handleClear}>
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

export default SearchInput;
