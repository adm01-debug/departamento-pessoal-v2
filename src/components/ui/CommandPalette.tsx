import React, { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { Search, FileText, Settings, User, Home, Clock, Star } from "lucide-react";

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  shortcut?: string;
  group?: string;
  onSelect?: () => void;
}

interface CommandPaletteProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  items: CommandItem[];
  recentItems?: CommandItem[];
  placeholder?: string;
  className?: string;
}

export function CommandPalette({ open, onOpenChange, items, recentItems = [], placeholder = "Digite um comando ou busque...", className }: CommandPaletteProps) {
  const [search, setSearch] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange?.(!open);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  const groupedItems = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {};
    items.forEach(item => {
      const group = item.group || "Geral";
      if (!groups[group]) groups[group] = [];
      groups[group].push(item);
    });
    return groups;
  }, [items]);

  const handleSelect = (item: CommandItem) => {
    item.onSelect?.();
    onOpenChange?.(false);
    setSearch("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("p-0 max-w-lg overflow-hidden", className)}>
        <Command className="rounded-lg border-0">
          <CommandInput placeholder={placeholder} value={search} onValueChange={setSearch} />
          <CommandList className="max-h-[400px]">
            <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
            {recentItems.length > 0 && !search && (
              <CommandGroup heading="Recentes">
                {recentItems.map(item => (
                  <CommandItem key={item.id} onSelect={() => handleSelect(item)} className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    {item.icon}
                    <span>{item.label}</span>
                    {item.shortcut && <span className="ml-auto text-xs text-muted-foreground">{item.shortcut}</span>}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {Object.entries(groupedItems).map(([group, groupItems]) => (
              <CommandGroup key={group} heading={group}>
                {groupItems.map(item => (
                  <CommandItem key={item.id} onSelect={() => handleSelect(item)} className="flex items-center gap-2">
                    {item.icon}
                    <div className="flex flex-col">
                      <span>{item.label}</span>
                      {item.description && <span className="text-xs text-muted-foreground">{item.description}</span>}
                    </div>
                    {item.shortcut && <span className="ml-auto text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{item.shortcut}</span>}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
export default CommandPalette;
