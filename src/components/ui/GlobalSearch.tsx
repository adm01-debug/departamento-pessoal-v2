import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { User, FileText, Settings, Calendar } from "lucide-react";

interface SearchResult { id: string; title: string; type: "employee" | "document" | "setting" | "event"; description?: string; }
interface GlobalSearchProps { open: boolean; onOpenChange: (open: boolean) => void; results: SearchResult[]; onSearch: (query: string) => void; onSelect: (result: SearchResult) => void; }

const icons = { employee: User, document: FileText, setting: Settings, event: Calendar };

export function GlobalSearch({ open, onOpenChange, results, onSearch, onSelect }: GlobalSearchProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 max-w-lg">
        <Command>
          <CommandInput placeholder="Buscar funcionários, documentos..." onValueChange={onSearch} />
          <CommandList>
            <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
            <CommandGroup heading="Resultados">
              {results.map((result) => {
                const Icon = icons[result.type];
                return (
                  <CommandItem key={result.id} onSelect={() => { onSelect(result); onOpenChange(false); }}>
                    <Icon className="h-4 w-4 mr-2 text-muted-foreground" />
                    <div><p className="font-medium">{result.title}</p>{result.description && <p className="text-xs text-muted-foreground">{result.description}</p>}</div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
export default GlobalSearch;
