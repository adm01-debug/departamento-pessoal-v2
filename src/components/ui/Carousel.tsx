import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselProps { children: React.ReactNode[]; className?: string; }

export function Carousel({ children, className }: CarouselProps) {
  const [current, setCurrent] = React.useState(0);
  const prev = () => setCurrent((c) => (c - 1 + children.length) % children.length);
  const next = () => setCurrent((c) => (c + 1) % children.length);
  return (
    <div className={cn("relative", className)}>
      <div className="overflow-hidden">{children[current]}</div>
      <Button variant="outline" size="icon" className="absolute left-2 top-1/2 -translate-y-1/2" onClick={prev}><ChevronLeft className="h-4 w-4" /></Button>
      <Button variant="outline" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2" onClick={next}><ChevronRight className="h-4 w-4" /></Button>
      <div className="flex justify-center gap-2 mt-4">{children.map((_, i) => <button key={i} className={cn("h-2 w-2 rounded-full", i === current ? "bg-primary" : "bg-muted")} onClick={() => setCurrent(i)} />)}</div>
    </div>
  );
}
export default Carousel;
