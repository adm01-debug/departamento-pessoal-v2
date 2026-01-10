import React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface Reply { id: string; author: { name: string; avatar?: string }; content: string; timestamp: string; }
interface ReplyThreadProps { replies: Reply[]; onReply?: () => void; className?: string; }

export function ReplyThread({ replies, onReply, className }: ReplyThreadProps) {
  return (
    <div className={cn("space-y-3 pl-6 border-l-2", className)}>
      {replies.map((reply) => (
        <div key={reply.id} className="flex gap-3">
          <Avatar className="h-8 w-8"><AvatarImage src={reply.author.avatar} /><AvatarFallback>{reply.author.name[0]}</AvatarFallback></Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2"><span className="font-medium text-sm">{reply.author.name}</span><span className="text-xs text-muted-foreground">{reply.timestamp}</span></div>
            <p className="text-sm mt-1">{reply.content}</p>
          </div>
        </div>
      ))}
      {onReply && <Button variant="ghost" size="sm" onClick={onReply}><MessageCircle className="h-4 w-4 mr-1" />Responder</Button>}
    </div>
  );
}
export default ReplyThread;
