import { memo } from "react";
interface InputContainerProps { children: React.ReactNode; className?: string; }
export const InputContainer = memo(function InputContainer({ children, className }: InputContainerProps) {
  return <div className={`space-y-2 ${className || ""}`}>{children}</div>;
});
