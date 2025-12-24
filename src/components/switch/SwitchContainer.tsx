import { memo } from "react";
interface SwitchContainerProps { children: React.ReactNode; className?: string; }
export const SwitchContainer = memo(function SwitchContainer({ children, className }: SwitchContainerProps) {
  return <div className={className || "flex items-center gap-2"}>{children}</div>;
});
