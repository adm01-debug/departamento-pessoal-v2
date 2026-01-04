import React from "react";
import { cn } from "@/lib/utils";

interface ThreeColumnLayoutProps { children: React.ReactNode; className?: string; sidebar?: React.ReactNode; header?: React.ReactNode; footer?: React.ReactNode; }

export function ThreeColumnLayout({ children, className, sidebar, header, footer }: ThreeColumnLayoutProps) {
  return (
    <div className={cn("min-h-screen flex flex-col", className)}>
      {header && <header className="border-b bg-background">{header}</header>}
      <div className="flex flex-1">
        {sidebar && <aside className="w-64 border-r bg-muted/10">{sidebar}</aside>}
        <main className="flex-1 p-6">{children}</main>
      </div>
      {footer && <footer className="border-t bg-background">{footer}</footer>}
    </div>
  );
}
export default ThreeColumnLayout;
