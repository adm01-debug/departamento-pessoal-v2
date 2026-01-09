import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface WeekdayPickerProps { label?: string; value: number[]; onChange: (days: number[]) => void; disabled?: boolean; className?: string; }

const days = [{ value: 0, label: "D" }, { value: 1, label: "S" }, { value: 2, label: "T" }, { value: 3, label: "Q" }, { value: 4, label: "Q" }, { value: 5, label: "S" }, { value: 6, label: "S" }];

export function WeekdayPicker({ label, value = [], onChange, disabled, className }: WeekdayPickerProps) {
  const toggle = (day: number) => onChange(value.includes(day) ? value.filter((d) => d !== day) : [...value, day].sort());

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}
      <div className="flex gap-1">
        {days.map((day) => (
          <Button key={day.value} type="button" variant={value.includes(day.value) ? "default" : "outline"} size="icon" className="h-8 w-8 rounded-full" onClick={() => toggle(day.value)} disabled={disabled}>
            {day.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
export default WeekdayPicker;
