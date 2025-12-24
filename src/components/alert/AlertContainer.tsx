import { memo } from "react";
import { Alert } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
interface AlertContainerProps { children: React.ReactNode; variant?: "default" | "destructive"; className?: string; }
export const AlertContainer = memo(function AlertContainer({ children, variant = "default", className }: AlertContainerProps) {
  return <Alert variant={variant} className={cn(className)}>{children}</Alert>;
});
