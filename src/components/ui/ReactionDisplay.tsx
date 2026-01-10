import React from "react";
import { cn } from "@/lib/utils";

interface Reaction { emoji: string; count: number; reacted: boolean; }
interface ReactionDisplayProps { reactions: Reaction[]; onToggle?: (emoji: string) => void; className?: string; }

export function ReactionDisplay({ reactions, onToggle, className }: ReactionDisplayProps) {
  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {reactions.map((reaction) => (
        <button key={reaction.emoji} className={cn("inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm border", reaction.reacted ? "bg-primary/10 border-primary" : "bg-muted border-transparent", onToggle && "cursor-pointer hover:bg-muted")} onClick={() => onToggle?.(reaction.emoji)}>
          <span>{reaction.emoji}</span>
          <span className="text-xs">{reaction.count}</span>
        </button>
      ))}
    </div>
  );
}
export default ReactionDisplay;
