import React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface PINInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  masked?: boolean;
  className?: string;
}

export function PINInput({ length = 4, value, onChange, masked = true, className }: PINInputProps) {
  const refs = React.useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (i: number, v: string) => {
    if (!/^\d*$/.test(v)) return;
    const newValue = value.split("");
    newValue[i] = v;
    onChange(newValue.join("").slice(0, length));
    if (v && i < length - 1) refs.current[i + 1]?.focus();
  };

  return (
    <div className={cn("flex gap-2", className)}>
      {Array.from({ length }).map((_, i) => (
        <Input
          key={i}
          ref={(el: HTMLInputElement | null) => { refs.current[i] = el; }}
          type={masked ? "password" : "text"}
          maxLength={1}
          value={value[i] || ""}
          onChange={(e) => handleChange(i, e.target.value)}
          className="w-12 h-12 text-center text-lg"
        />
      ))}
    </div>
  );
}

export default PINInput;
