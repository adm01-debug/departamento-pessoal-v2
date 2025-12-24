import { memo } from "react";
import { AlertTitle as AT } from "@/components/ui/alert";
interface AlertTitleProps { children: React.ReactNode; }
export const AlertTitle = memo(function AlertTitle({ children }: AlertTitleProps) {
  return <AT>{children}</AT>;
});
