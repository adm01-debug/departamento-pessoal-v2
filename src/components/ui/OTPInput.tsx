import React, { useRef, useState, KeyboardEvent, ClipboardEvent } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface OTPInputProps {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  className?: string;
  disabled?: boolean;
  type?: "text" | "number";
}

export function OTPInput({ length = 6, value = "", onChange, onComplete, className, disabled = false, type = "number" }: OTPInputProps) {
  const [otp, setOtp] = useState(value.split("").slice(0, length));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, val: string) => {
    const newOtp = [...otp];
    newOtp[index] = val.slice(-1);
    setOtp(newOtp);
    const newValue = newOtp.join("");
    onChange?.(newValue);
    if (val && index < length - 1) inputRefs.current[index + 1]?.focus();
    if (newValue.length === length) onComplete?.(newValue);
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").slice(0, length);
    const newOtp = pasted.split("");
    setOtp(newOtp);
    onChange?.(pasted);
    if (pasted.length === length) onComplete?.(pasted);
    inputRefs.current[Math.min(pasted.length, length - 1)]?.focus();
  };

  return (
    <div className={cn("flex gap-2", className)}>
      {Array.from({ length }, (_, i) => (
        <Input key={i} ref={(el: HTMLInputElement | null) => { inputRefs.current[i] = el; }} type={type === "number" ? "tel" : "text"} inputMode={type === "number" ? "numeric" : "text"} pattern={type === "number" ? "[0-9]*" : undefined} maxLength={1} value={otp[i] || ""} onChange={(e) => handleChange(i, e.target.value)} onKeyDown={(e) => handleKeyDown(i, e)} onPaste={handlePaste} disabled={disabled} className="w-12 h-12 text-center text-xl font-bold" />
      ))}
    </div>
  );
}
export default OTPInput;
