import { memo } from "react";
import { Label } from "@/components/ui/label";
interface SwitchLabelProps { htmlFor: string; children: React.ReactNode; }
export const SwitchLabel = memo(function SwitchLabel({ htmlFor, children }: SwitchLabelProps) {
  return <Label htmlFor={htmlFor}>{children}</Label>;
});
