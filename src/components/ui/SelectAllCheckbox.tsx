import React from "react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

interface SelectAllCheckboxProps {
  checked: boolean | "indeterminate";
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}

export function SelectAllCheckbox({ checked, onCheckedChange, className }: SelectAllCheckboxProps) {
  return (
    <Checkbox checked={checked} onCheckedChange={onCheckedChange} className={className} aria-label="Selecionar todos" />
  );
}
export default SelectAllCheckbox;
