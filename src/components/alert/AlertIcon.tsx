import { memo } from "react";
import { AlertCircle, CheckCircle, XCircle, Info } from "lucide-react";
interface AlertIconProps { type: "info" | "success" | "warning" | "error"; }
const icons = { info: Info, success: CheckCircle, warning: AlertCircle, error: XCircle };
export const AlertIcon = memo(function AlertIcon({ type }: AlertIconProps) {
  const Icon = icons[type];
  return <Icon className="h-4 w-4" />;
});
