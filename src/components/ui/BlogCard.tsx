import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock } from "lucide-react";

interface BlogCardProps {
  title: string;
  excerpt?: string;
  image?: string;
  category?: string;
  author?: { name: string; avatar?: string };
  date?: string;
  readTime?: string;
  onClick?: () => void;
  className?: string;
}

export function BlogCard({ title, excerpt, image, category, author, date, readTime, onClick, className }: BlogCardProps) {
  return (
    <Card className={cn("overflow-hidden cursor-pointer hover:shadow-lg transition-shadow", className)} onClick={onClick}>
      {image && (
        <div className="aspect-video overflow-hidden">
          <img src={image} alt={title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
        </div>
      )}
      <CardContent className="p-4">
        {category && <Badge variant="secondary" className="mb-2">{category}</Badge>}
        <h3 className="font-semibold text-lg line-clamp-2 hover:text-primary transition-colors">{title}</h3>
        {excerpt && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{excerpt}</p>}
        <div className="flex items-center justify-between mt-4">
          {author && (
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={author.avatar} />
                <AvatarFallback>{author.name[0]}</AvatarFallback>
              </Avatar>
              <span className="text-sm">{author.name}</span>
            </div>
          )}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {date && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{date}</span>}
            {readTime && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{readTime}</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
export default BlogCard;
