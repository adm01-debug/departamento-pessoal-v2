import React from "react";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface RatingStarsProps { value: number; max?: number; onChange?: (value: number) => void; size?: "sm" | "md" | "lg"; className?: string; }

const sizes = { sm: "h-4 w-4", md: "h-5 w-5", lg: "h-6 w-6" };

export function RatingStars({ value, max = 5, onChange, size = "md", className }: RatingStarsProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {Array.from({ length: max }).map((_, i) => (
        <button key={i} type="button" onClick={() => onChange?.(i + 1)} disabled={!onChange} className="focus:outline-none">
          <Star className={cn(sizes[size], i < value ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground", onChange && "cursor-pointer hover:text-yellow-400")} />
        </button>
      ))}
    </div>
  );
}
export default RatingStars;
