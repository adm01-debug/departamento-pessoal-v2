import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
interface ButtonLoadingProps { loading?: boolean; children: React.ReactNode; onClick?: () => void; variant?: "default" | "secondary" | "outline"; disabled?: boolean; }
export const ButtonLoading = memo(function ButtonLoading({ loading, children, onClick, variant = "default", disabled }: ButtonLoadingProps) {
  return <Button variant={variant} onClick={onClick} disabled={loading || disabled}>{loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}{children}</Button>;
});
