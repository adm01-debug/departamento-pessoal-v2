import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface LikeButtonProps { liked?: boolean; count?: number; onToggle?: (liked: boolean) => void; className?: string; }

export function LikeButton({ liked: initialLiked = false, count: initialCount = 0, onToggle, className }: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);

  const handleClick = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setCount(newLiked ? count + 1 : count - 1);
    onToggle?.(newLiked);
  };

  return (
    <Button variant="ghost" size="sm" className={cn("gap-1", className)} onClick={handleClick}>
      <Heart className={cn("h-4 w-4", liked && "fill-red-500 text-red-500")} />
      {count > 0 && <span>{count}</span>}
    </Button>
  );
}
export default LikeButton;
