import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { List } from "lucide-react";

interface TOCItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  items: TOCItem[];
  className?: string;
  title?: string;
}

export function TableOfContents({ items, className, title = "Conteúdo" }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-100px 0px -80% 0px" }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  return (
    <nav className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2 font-medium mb-4">
        <List className="h-4 w-4" />
        {title}
      </div>
      <ul className="space-y-1 text-sm">
        {items.map((item) => (
          <li key={item.id} style={{ paddingLeft: `${(item.level - 1) * 12}px` }}>
            <a href={`#${item.id}`} className={cn("block py-1 text-muted-foreground hover:text-foreground transition-colors", activeId === item.id && "text-primary font-medium")}>
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
export default TableOfContents;
