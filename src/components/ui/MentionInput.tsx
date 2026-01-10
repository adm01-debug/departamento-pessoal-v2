import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

interface MentionInputProps { value: string; onChange: (value: string) => void; onMention?: (query: string) => void; placeholder?: string; className?: string; }

export function MentionInput({ value, onChange, onMention, placeholder, className }: MentionInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    const match = newValue.match(/@(\w*)$/);
    if (match) onMention?.(match[1]);
  };

  return <Textarea value={value} onChange={handleChange} placeholder={placeholder} className={className} />;
}
export default MentionInput;
