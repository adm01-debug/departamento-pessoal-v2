import { memo } from "react";
interface InputHelperTextProps { children: React.ReactNode; }
export const InputHelperText = memo(function InputHelperText({ children }: InputHelperTextProps) {
  return <p className="text-sm text-muted-foreground">{children}</p>;
});
