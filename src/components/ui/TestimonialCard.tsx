import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Quote } from "lucide-react";

interface TestimonialCardProps {
  content: string;
  author: { name: string; role?: string; company?: string; avatar?: string };
  rating?: number;
  className?: string;
}

export function TestimonialCard({ content, author, rating, className }: TestimonialCardProps) {
  const initials = author.name.split(" ").map(n => n[0]).join("").slice(0, 2);

  return (
    <Card className={cn("relative", className)}>
      <CardContent className="pt-6">
        <Quote className="h-8 w-8 text-primary/20 absolute top-4 left-4" />
        {rating && (
          <div className="flex gap-0.5 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={cn("h-4 w-4", i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted")} />
            ))}
          </div>
        )}
        <p className="text-muted-foreground italic mb-6 relative z-10">"{content}"</p>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={author.avatar} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{author.name}</p>
            {(author.role || author.company) && (
              <p className="text-sm text-muted-foreground">
                {author.role}{author.role && author.company && " • "}{author.company}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
export default TestimonialCard;
