import { memo } from "react";
import { Label } from "@/components/ui/label";
interface InputLabelProps { htmlFor?: string; children: React.ReactNode; required?: boolean; }
export const InputLabel = memo(function InputLabel({ htmlFor, children, required }: InputLabelProps) {
  return <Label htmlFor={htmlFor}>{children}{required && <span className="text-destructive ml-1">*</span>}</Label>;
});
