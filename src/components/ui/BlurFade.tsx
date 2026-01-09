import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface BlurFadeProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  blur?: string;
  className?: string;
  yOffset?: number;
}

export function BlurFade({ children, delay = 0, duration = 0.4, blur = "6px", className, yOffset = 6 }: BlurFadeProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setTimeout(() => setIsVisible(true), delay * 1000); } }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={cn("transition-all", className)} style={{ opacity: isVisible ? 1 : 0, filter: isVisible ? "blur(0)" : `blur(${blur})`, transform: isVisible ? "translateY(0)" : `translateY(${yOffset}px)`, transitionDuration: `${duration}s`, transitionDelay: `${delay}s` }}>
      {children}
    </div>
  );
}
export default BlurFade;
