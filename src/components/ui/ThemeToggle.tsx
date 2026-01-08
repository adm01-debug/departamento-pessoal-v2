import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sun, Moon, Monitor, Palette } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

interface ThemeToggleProps {
  className?: string;
  variant?: "button" | "dropdown" | "switch";
}

export function ThemeToggle({ className, variant = "dropdown" }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme?.() || { theme: "system", setTheme: () => {}, resolvedTheme: "light" };

  if (variant === "button") {
    return (
      <Button variant="ghost" size="icon" className={className} onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Alternar tema</span>
      </Button>
    );
  }

  if (variant === "switch") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Sun className="h-4 w-4" />
        <button className={cn("relative w-12 h-6 rounded-full transition-colors", resolvedTheme === "dark" ? "bg-primary" : "bg-muted")} onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
          <span className={cn("absolute top-1 w-4 h-4 rounded-full bg-white transition-transform", resolvedTheme === "dark" ? "left-7" : "left-1")} />
        </button>
        <Moon className="h-4 w-4" />
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={className}>
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Alternar tema</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="mr-2 h-4 w-4" />Claro
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" />Escuro
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Monitor className="mr-2 h-4 w-4" />Sistema
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default ThemeToggle;
