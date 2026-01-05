import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
interface UserAvatarProps { name: string; image?: string; size?: "sm" | "md" | "lg"; className?: string; showName?: boolean; subtitle?: string; }
const sizes = { sm: "h-8 w-8", md: "h-10 w-10", lg: "h-12 w-12" };
const textSizes = { sm: "text-xs", md: "text-sm", lg: "text-base" };
export function UserAvatar({ name, image, size = "md", className, showName, subtitle }: UserAvatarProps) {
  const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
  return (
    <div className={cn("flex items-center gap-2", className)}><Avatar className={sizes[size]}><AvatarImage src={image} alt={name} /><AvatarFallback className={textSizes[size]}>{initials}</AvatarFallback></Avatar>{showName && <div><p className={cn("font-medium", textSizes[size])}>{name}</p>{subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}</div>}</div>
  );
}
export default UserAvatar;
