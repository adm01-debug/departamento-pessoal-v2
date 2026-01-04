import React from "react";
import { cn } from "@/lib/utils";

interface ToggleProps {
  children?: React.ReactNode;
  className?: string;
  variant?: "default" | "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

export function Toggle({ children, className, variant = "default", size = "md", disabled = false, loading = false, onClick }: ToggleProps) {
  const sizeClasses = { sm: "text-sm p-2", md: "text-base p-3", lg: "text-lg p-4" };
  const variantClasses = {
    default: "bg-background border",
    primary: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    outline: "border border-input bg-transparent",
  };

  return (
    <div
      className={cn(
        "rounded-lg transition-all",
        sizeClasses[size],
        variantClasses[variant],
        disabled && "opacity-50 cursor-not-allowed",
        loading && "animate-pulse",
        onClick && !disabled && "cursor-pointer hover:opacity-80",
        className
      )}
      onClick={disabled ? undefined : onClick}
      role={onClick ? "button" : undefined}
      aria-disabled={disabled}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </div>
      ) : children}
    </div>
  );
}

export default Toggle;
