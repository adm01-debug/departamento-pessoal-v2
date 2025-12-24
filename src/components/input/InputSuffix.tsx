import { memo } from "react";
interface InputSuffixProps { children: React.ReactNode; }
export const InputSuffix = memo(function InputSuffix({ children }: InputSuffixProps) {
  return <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">{children}</span>;
});
