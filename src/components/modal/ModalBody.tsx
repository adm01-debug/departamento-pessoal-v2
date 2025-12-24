import { memo } from "react";
interface ModalBodyProps { children: React.ReactNode; className?: string; }
export const ModalBody = memo(function ModalBody({ children, className }: ModalBodyProps) {
  return <div className={className || "py-4"}>{children}</div>;
});
