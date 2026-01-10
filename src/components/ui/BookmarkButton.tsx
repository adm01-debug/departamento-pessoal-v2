import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";

interface BookmarkButtonProps { bookmarked?: boolean; onToggle?: (bookmarked: boolean) => void; className?: string; }

export function BookmarkButton({ bookmarked: initialBookmarked = false, onToggle, className }: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);

  const handleClick = () => {
    const newBookmarked = !bookmarked;
    setBookmarked(newBookmarked);
    onToggle?.(newBookmarked);
  };

  return (
    <Button variant="ghost" size="icon" className={className} onClick={handleClick}>
      <Bookmark className={cn("h-5 w-5", bookmarked && "fill-current")} />
    </Button>
  );
}
export default BookmarkButton;
