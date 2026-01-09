import React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ThumbsUp, MessageSquare, MoreHorizontal } from "lucide-react";

interface CommentItemProps { author: { name: string; avatar?: string }; content: string; timestamp: Date; likes?: number; replies?: number; onLike?: () => void; onReply?: () => void; className?: string; }

export function CommentItem({ author, content, timestamp, likes = 0, replies = 0, onLike, onReply, className }: CommentItemProps) {
  return (
    <div className={cn("flex gap-3", className)}>
      <Avatar className="h-8 w-8"><AvatarImage src={author.avatar} /><AvatarFallback>{author.name[0]}</AvatarFallback></Avatar>
      <div className="flex-1">
        <div className="bg-muted rounded-lg p-3">
          <div className="flex items-center justify-between"><p className="font-medium text-sm">{author.name}</p><Button variant="ghost" size="icon" className="h-6 w-6"><MoreHorizontal className="h-4 w-4" /></Button></div>
          <p className="text-sm mt-1">{content}</p>
        </div>
        <div className="flex items-center gap-4 mt-1 px-1">
          <span className="text-xs text-muted-foreground">{formatDistanceToNow(timestamp, { addSuffix: true, locale: ptBR })}</span>
          {onLike && <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1" onClick={onLike}><ThumbsUp className="h-3 w-3" />{likes > 0 && likes}</button>}
          {onReply && <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1" onClick={onReply}><MessageSquare className="h-3 w-3" />Responder</button>}
        </div>
      </div>
    </div>
  );
}
export default CommentItem;
