import { memo } from "react";
import { Button } from "@/components/ui/button";
interface ButtonIconProps { icon: React.ReactNode; onClick?: () => void; variant?: "default" | "secondary" | "ghost" | "outline"; size?: "default" | "sm" | "lg" | "icon"; }
export const ButtonIcon = memo(function ButtonIcon({ icon, onClick, variant = "ghost", size = "icon" }: ButtonIconProps) {
  return <Button variant={variant} size={size} onClick={onClick}>{icon}</Button>;
});
