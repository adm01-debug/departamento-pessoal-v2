import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface TiltCardProps {
  children: React.ReactNode;
  maxTilt?: number;
  scale?: number;
  className?: string;
}

export function TiltCard({ children, maxTilt = 10, scale = 1.02, className }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState({ transform: "perspective(1000px) rotateX(0) rotateY(0) scale(1)" });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setStyle({ transform: `perspective(1000px) rotateX(${-y * maxTilt}deg) rotateY(${x * maxTilt}deg) scale(${scale})` });
  };

  const handleLeave = () => setStyle({ transform: "perspective(1000px) rotateX(0) rotateY(0) scale(1)" });

  return (
    <Card ref={ref} className={cn("transition-transform duration-200", className)} style={style} onMouseMove={handleMove} onMouseLeave={handleLeave}>
      {children}
    </Card>
  );
}
export default TiltCard;
