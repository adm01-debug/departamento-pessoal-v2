import { memo } from "react";
import { AlertDescription as AD } from "@/components/ui/alert";
interface AlertDescriptionProps { children: React.ReactNode; }
export const AlertDescription = memo(function AlertDescription({ children }: AlertDescriptionProps) {
  return <AD>{children}</AD>;
});
