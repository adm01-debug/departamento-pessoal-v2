import React from "react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Home, Settings, Mail, Calendar, Clock, File, Folder, Star, Heart, Bell, Search, HelpCircle, LucideIcon } from "lucide-react";

interface IconSelectorProps { value: string; onChange: (icon: string) => void; className?: string; }

const iconMap: Record<string, LucideIcon> = { User, Home, Settings, Mail, Calendar, Clock, File, Folder, Star, Heart, Bell, Search };

export function IconSelector({ value, onChange, className }: IconSelectorProps) {
  const [search, setSearch] = React.useState("");
  const CurrentIcon = iconMap[value] || HelpCircle;
  const filtered = Object.keys(iconMap).filter((i) => i.toLowerCase().includes(search.toLowerCase()));

  return (
    <Popover>
      <PopoverTrigger asChild><Button variant="outline" className={cn("w-10 h-10 p-0", className)}><CurrentIcon className="h-5 w-5" /></Button></PopoverTrigger>
      <PopoverContent className="w-64">
        <Input placeholder="Buscar ícone..." value={search} onChange={(e) => setSearch(e.target.value)} className="mb-2" />
        <div className="grid grid-cols-6 gap-1 max-h-48 overflow-y-auto">
          {filtered.map((iconName) => { const Icon = iconMap[iconName]; return (<button key={iconName} className={cn("p-2 rounded hover:bg-muted", value === iconName && "bg-primary/10")} onClick={() => onChange(iconName)}><Icon className="h-4 w-4" /></button>); })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
export default IconSelector;
