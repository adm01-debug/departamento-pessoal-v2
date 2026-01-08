import React, { useState, useRef, KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface TagInputProps {
  value?: string[];
  onChange?: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  allowDuplicates?: boolean;
  className?: string;
  tagClassName?: string;
  suggestions?: string[];
  disabled?: boolean;
}

export function TagInput({ value = [], onChange, placeholder = "Adicionar tag...", maxTags, allowDuplicates = false, className, tagClassName, suggestions = [], disabled = false }: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (!trimmed) return;
    if (!allowDuplicates && value.includes(trimmed)) return;
    if (maxTags && value.length >= maxTags) return;
    onChange?.([...value, trimmed]);
    setInputValue("");
  };

  const removeTag = (index: number) => {
    onChange?.(value.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      removeTag(value.length - 1);
    }
  };

  const filteredSuggestions = suggestions.filter(s => s.toLowerCase().includes(inputValue.toLowerCase()) && !value.includes(s));

  return (
    <div className={cn("relative", className)}>
      <div className={cn("flex flex-wrap gap-1 p-2 border rounded-md bg-background min-h-[42px]", disabled && "opacity-50 cursor-not-allowed")} onClick={() => inputRef.current?.focus()}>
        {value.map((tag, index) => (
          <Badge key={index} variant="secondary" className={cn("gap-1", tagClassName)}>
            {tag}
            {!disabled && (
              <button type="button" onClick={(e) => { e.stopPropagation(); removeTag(index); }} className="hover:bg-muted-foreground/20 rounded-full">
                <X className="h-3 w-3" />
              </button>
            )}
          </Badge>
        ))}
        <Input ref={inputRef} value={inputValue} onChange={(e) => { setInputValue(e.target.value); setShowSuggestions(true); }} onKeyDown={handleKeyDown} onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} placeholder={value.length === 0 ? placeholder : ""} disabled={disabled || (maxTags !== undefined && value.length >= maxTags)} className="flex-1 min-w-[120px] border-0 p-0 h-6 focus-visible:ring-0" />
      </div>
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-md shadow-lg z-50 max-h-40 overflow-auto">
          {filteredSuggestions.map((suggestion, i) => (
            <button key={i} type="button" className="w-full px-3 py-2 text-left text-sm hover:bg-accent" onMouseDown={() => addTag(suggestion)}>{suggestion}</button>
          ))}
        </div>
      )}
    </div>
  );
}
export default TagInput;
