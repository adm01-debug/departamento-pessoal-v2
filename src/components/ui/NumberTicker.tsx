import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface NumberTickerProps {
  value: number;
  duration?: number;
  format?: (value: number) => string;
  className?: string;
  decimalPlaces?: number;
}

export function NumberTicker({ value, duration = 1000, format, className, decimalPlaces = 0 }: NumberTickerProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const prevValue = useRef(0);

  useEffect(() => {
    const startValue = prevValue.current;
    const diff = value - startValue;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(startValue + diff * eased);

      if (progress < 1) requestAnimationFrame(animate);
      else { setDisplayValue(value); prevValue.current = value; }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  const formatted = format ? format(displayValue) : displayValue.toFixed(decimalPlaces);

  return <span className={cn("tabular-nums", className)}>{formatted}</span>;
}
export default NumberTicker;
