import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";

interface BackToTopProps {
  threshold?: number;
  smooth?: boolean;
  className?: string;
}

export function BackToTop({ threshold = 300, smooth = true, className }: BackToTopProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => setIsVisible(window.scrollY > threshold);
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
  };

  if (!isVisible) return null;

  return (
    <Button variant="secondary" size="icon" className={cn("fixed bottom-4 right-4 z-50 rounded-full shadow-lg animate-in fade-in slide-in-from-bottom-4", className)} onClick={scrollToTop}>
      <ArrowUp className="h-4 w-4" />
    </Button>
  );
}
export default BackToTop;
