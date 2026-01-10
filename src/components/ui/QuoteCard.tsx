import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface QuoteCard { quote: string; author: string; role?: string; avatar?: string; className?: string; }

export function QuoteCard({ quote, author, role, avatar, className }: QuoteCard) {
  return (
    <Card className={className}>
      <CardContent className="pt-6">
        <p className="text-sm italic mb-4">"{quote}"</p>
        <div className="flex items-center gap-3">
          <Avatar><AvatarImage src={avatar} /><AvatarFallback>{author[0]}</AvatarFallback></Avatar>
          <div><p className="font-medium text-sm">{author}</p>{role && <p className="text-xs text-muted-foreground">{role}</p>}</div>
        </div>
      </CardContent>
    </Card>
  );
}
export default QuoteCard;
