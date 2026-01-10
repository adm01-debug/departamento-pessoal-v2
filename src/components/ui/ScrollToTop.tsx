import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronUp } from "lucide-react";

interface ScrollToTopProps { threshold?: number; className?: string; }

export function ScrollToTop({ threshold = 300, className }: ScrollToTopProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => setVisible(window.scrollY > threshold);
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, [threshold]);

  if (!visible) return null;

  return (
    <Button size="icon" className={cn("fixed bottom-6 right-6 rounded-full shadow-lg", className)} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
      <ChevronUp className="h-5 w-5" />
    </Button>
  );
}
export default ScrollToTop;
