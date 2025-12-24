import { memo } from "react";
interface InputPrefixProps { children: React.ReactNode; }
export const InputPrefix = memo(function InputPrefix({ children }: InputPrefixProps) {
  return <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{children}</span>;
});
