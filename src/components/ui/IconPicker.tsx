import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import * as Icons from "lucide-react";

interface IconPickerProps { value?: string; onChange: (icon: string) => void; className?: string; }

const iconList = ["Home", "User", "Settings", "Mail", "Phone", "Calendar", "Clock", "Search", "Star", "Heart", "Bell", "File", "Folder", "Image", "Video", "Music", "Camera", "Map", "Globe", "Lock", "Key", "Shield", "Flag", "Tag", "Bookmark", "Link", "Send", "Share", "Download", "Upload", "Trash", "Edit", "Check", "X", "Plus", "Minus"];

export function IconPicker({ value, onChange, className }: IconPickerProps) {
  const [search, setSearch] = useState("");
  const filtered = iconList.filter((name) => name.toLowerCase().includes(search.toLowerCase()));
  const SelectedIcon = value ? (Icons as any)[value] : Icons.CircleDot;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn("w-full justify-start gap-2", className)}>
          <SelectedIcon className="h-4 w-4" />
          {value || "Selecionar ícone"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <Input placeholder="Buscar ícone..." value={search} onChange={(e) => setSearch(e.target.value)} className="mb-2" />
        <ScrollArea className="h-48">
          <div className="grid grid-cols-6 gap-1">
            {filtered.map((name) => {
              const Icon = (Icons as any)[name];
              return <button key={name} className={cn("p-2 rounded hover:bg-muted", value === name && "bg-primary text-primary-foreground")} onClick={() => onChange(name)}><Icon className="h-4 w-4" /></button>;
            })}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
export default IconPicker;
