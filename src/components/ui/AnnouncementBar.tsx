import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { X, ExternalLink } from "lucide-react";

interface AnnouncementBarProps {
  message: string;
  link?: { text: string; href: string };
  variant?: "default" | "success" | "warning" | "error";
  dismissible?: boolean;
  className?: string;
}

export function AnnouncementBar({ message, link, variant = "default", dismissible = true, className }: AnnouncementBarProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const variants = {
    default: "bg-primary text-primary-foreground",
    success: "bg-green-500 text-white",
    warning: "bg-yellow-500 text-white",
    error: "bg-red-500 text-white",
  };

  return (
    <div className={cn("py-2 px-4", variants[variant], className)}>
      <div className="container mx-auto flex items-center justify-center gap-4 text-sm">
        <span>{message}</span>
        {link && (
          <a href={link.href} className="font-medium underline underline-offset-4 flex items-center gap-1 hover:opacity-80">
            {link.text}
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
        {dismissible && (
          <Button variant="ghost" size="icon" className="h-6 w-6 absolute right-4 hover:bg-white/20" onClick={() => setIsVisible(false)}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
export default AnnouncementBar;
