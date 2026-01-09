import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface FlipCardProps {
  front: React.ReactNode;
  back: React.ReactNode;
  flipOnHover?: boolean;
  className?: string;
}

export function FlipCard({ front, back, flipOnHover = false, className }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className={cn("relative h-64 w-full perspective-1000", className)} onClick={() => !flipOnHover && setIsFlipped(!isFlipped)} onMouseEnter={() => flipOnHover && setIsFlipped(true)} onMouseLeave={() => flipOnHover && setIsFlipped(false)}>
      <div className={cn("relative w-full h-full transition-transform duration-500 transform-style-3d", isFlipped && "rotate-y-180")} style={{ transformStyle: "preserve-3d" }}>
        <div className="absolute inset-0 backface-hidden bg-card border rounded-lg p-4" style={{ backfaceVisibility: "hidden" }}>{front}</div>
        <div className="absolute inset-0 backface-hidden bg-card border rounded-lg p-4 rotate-y-180" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>{back}</div>
      </div>
      <style>{`.rotate-y-180 { transform: rotateY(180deg); }`}</style>
    </div>
  );
}
export default FlipCard;
