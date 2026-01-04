import React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

interface TimePickerProps { className?: string; label?: string; value?: any; onChange?: (value: any) => void; disabled?: boolean; error?: string; required?: boolean; placeholder?: string; options?: { value: string; label: string }[]; }

export function TimePicker({ className, label, value, onChange, disabled, error, required, placeholder, options = [] }: TimePickerProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label className={cn(required && "after:content-['*'] after:ml-0.5 after:text-red-500")}>{label}</Label>}
      <input
        type="text"
        value={value || ""}
        onChange={e => onChange?.(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className={cn("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm", disabled && "opacity-50 cursor-not-allowed", error && "border-red-500")}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

export default TimePicker;
