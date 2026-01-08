import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Globe, Check } from "lucide-react";

interface Language {
  code: string;
  name: string;
  flag?: string;
  nativeName?: string;
}

interface LanguageSelectorProps {
  languages: Language[];
  currentLanguage: string;
  className?: string;
  showFlag?: boolean;
  showNativeName?: boolean;
  onLanguageChange?: (code: string) => void;
}

const defaultLanguages: Language[] = [
  { code: "pt-BR", name: "Português", nativeName: "Português (Brasil)", flag: "🇧🇷" },
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
];

export function LanguageSelector({ languages = defaultLanguages, currentLanguage, className, showFlag = true, showNativeName = false, onLanguageChange }: LanguageSelectorProps) {
  const current = languages.find(l => l.code === currentLanguage) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className={cn("gap-2", className)}>
          {showFlag && current.flag ? <span>{current.flag}</span> : <Globe className="h-4 w-4" />}
          <span className="hidden sm:inline">{showNativeName ? current.nativeName : current.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map(lang => (
          <DropdownMenuItem key={lang.code} onClick={() => onLanguageChange?.(lang.code)} className="flex items-center gap-2">
            {showFlag && lang.flag && <span>{lang.flag}</span>}
            <span>{showNativeName ? lang.nativeName : lang.name}</span>
            {lang.code === currentLanguage && <Check className="h-4 w-4 ml-auto" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default LanguageSelector;
