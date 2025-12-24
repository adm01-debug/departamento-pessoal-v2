import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
interface ButtonLoadingProps { loading?: boolean; children: React.ReactNode; onClick?: () => void; disabled?: boolean; }
export const ButtonLoading = memo(function ButtonLoading({ loading, children, onClick, disabled }: ButtonLoadingProps) {
  return <Button onClick={onClick} disabled={loading || disabled}>{loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}{children}</Button>;
});
