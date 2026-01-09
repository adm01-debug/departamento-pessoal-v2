import React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatMessageProps { content: string; sender: { name: string; avatar?: string }; timestamp: string; isOwn?: boolean; className?: string; }

export function ChatMessage({ content, sender, timestamp, isOwn = false, className }: ChatMessageProps) {
  return (
    <div className={cn("flex gap-2", isOwn && "flex-row-reverse", className)}>
      <Avatar className="h-8 w-8"><AvatarImage src={sender.avatar} /><AvatarFallback>{sender.name[0]}</AvatarFallback></Avatar>
      <div className={cn("max-w-[70%]", isOwn && "text-right")}>
        <div className={cn("rounded-lg p-3", isOwn ? "bg-primary text-primary-foreground" : "bg-muted")}>
          <p className="text-sm">{content}</p>
        </div>
        <p className="text-xs text-muted-foreground mt-1">{timestamp}</p>
      </div>
    </div>
  );
}
export default ChatMessage;
