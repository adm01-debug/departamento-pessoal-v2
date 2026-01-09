import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Star, Heart, ThumbsUp } from "lucide-react";

type RatingIcon = "star" | "heart" | "thumb";

interface RatingInputProps {
  value?: number;
  onChange?: (value: number) => void;
  max?: number;
  icon?: RatingIcon;
  size?: "sm" | "md" | "lg";
  readonly?: boolean;
  showValue?: boolean;
  className?: string;
}

export function RatingInput({ value = 0, onChange, max = 5, icon = "star", size = "md", readonly = false, showValue = false, className }: RatingInputProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const displayValue = hoverValue ?? value;

  const sizes = { sm: "h-4 w-4", md: "h-6 w-6", lg: "h-8 w-8" };
  const IconComponent = icon === "heart" ? Heart : icon === "thumb" ? ThumbsUp : Star;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {Array.from({ length: max }, (_, i) => i + 1).map((rating) => (
        <button key={rating} type="button" className={cn("transition-colors", readonly ? "cursor-default" : "cursor-pointer hover:scale-110")} onMouseEnter={() => !readonly && setHoverValue(rating)} onMouseLeave={() => setHoverValue(null)} onClick={() => !readonly && onChange?.(rating === value ? 0 : rating)}>
          <IconComponent className={cn(sizes[size], rating <= displayValue ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground")} />
        </button>
      ))}
      {showValue && <span className="ml-2 text-sm text-muted-foreground">{value}/{max}</span>}
    </div>
  );
}
export default RatingInput;
