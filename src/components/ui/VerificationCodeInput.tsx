import React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface VerificationCodeInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function VerificationCodeInput({ length = 6, value, onChange, className }: VerificationCodeInputProps) {
  const refs = React.useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (i: number, v: string) => {
    const newValue = value.split("");
    newValue[i] = v;
    onChange(newValue.join("").slice(0, length));
    if (v && i < length - 1) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !value[i] && i > 0) refs.current[i - 1]?.focus();
  };

  return (
    <div className={cn("flex gap-2", className)}>
      {Array.from({ length }).map((_, i) => (
        <Input
          key={i}
          ref={(el: HTMLInputElement | null) => { refs.current[i] = el; }}
          type="text"
          maxLength={1}
          value={value[i] || ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className="w-12 h-12 text-center text-lg"
        />
      ))}
    </div>
  );
}

export default VerificationCodeInput;
