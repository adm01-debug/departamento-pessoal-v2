import { memo } from "react";
import { Label } from "@/components/ui/label";
interface InputLabelProps { children: React.ReactNode; required?: boolean; htmlFor?: string; }
export const InputLabel = memo(function InputLabel({ children, required, htmlFor }: InputLabelProps) {
  return <Label htmlFor={htmlFor}>{children}{required && <span className="text-destructive ml-1">*</span>}</Label>;
});
