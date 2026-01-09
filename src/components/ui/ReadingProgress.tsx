import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ReadingProgressProps {
  className?: string;
  height?: number;
  color?: string;
}

export function ReadingProgress({ className, height = 3, color }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const calculateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(scrollProgress);
    };

    window.addEventListener("scroll", calculateProgress);
    return () => window.removeEventListener("scroll", calculateProgress);
  }, []);

  return (
    <div className={cn("fixed top-0 left-0 right-0 z-50", className)} style={{ height }}>
      <div className="h-full bg-primary transition-all duration-150" style={{ width: `${progress}%`, backgroundColor: color }} />
    </div>
  );
}
export default ReadingProgress;
