import React from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  children: React.ReactNode;
  speed?: number;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  className?: string;
}

export function Marquee({ children, speed = 20, direction = "left", pauseOnHover = true, className }: MarqueeProps) {
  return (
    <div className={cn("overflow-hidden whitespace-nowrap", pauseOnHover && "group", className)}>
      <div className={cn("inline-flex animate-marquee", pauseOnHover && "group-hover:pause")} style={{ animationDuration: `${speed}s`, animationDirection: direction === "right" ? "reverse" : "normal" }}>
        {children}
        {children}
      </div>
      <style>{`
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee linear infinite; }
        .group-hover\\:pause:hover { animation-play-state: paused; }
      `}</style>
    </div>
  );
}
export default Marquee;
