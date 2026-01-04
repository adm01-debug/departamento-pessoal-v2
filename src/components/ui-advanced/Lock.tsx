import * as React from "react";
import { cn } from "@/lib/utils";
export interface LockProps extends React.HTMLAttributes<HTMLDivElement> { variant?: "default" | "outline" | "ghost"; size?: "sm" | "md" | "lg"; disabled?: boolean; }
const Lock = React.forwardRef<HTMLDivElement, LockProps>(({ className, variant = "default", size = "md", disabled = false, children, ...props }, ref) => {
  const variants = { default: "bg-primary text-primary-foreground", outline: "border border-input bg-background", ghost: "hover:bg-accent" };
  const sizes = { sm: "p-2 text-sm", md: "p-4 text-base", lg: "p-6 text-lg" };
  return (<div ref={ref} className={cn("rounded-lg transition-colors", variants[variant], sizes[size], disabled && "opacity-50 pointer-events-none", className)} {...props}>{children}</div>);
});
Lock.displayName = "Lock";
export { Lock };
export default Lock;
