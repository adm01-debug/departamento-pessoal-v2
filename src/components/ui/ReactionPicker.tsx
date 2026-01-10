import React from "react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { SmilePlus } from "lucide-react";

interface ReactionPickerProps { onSelect: (emoji: string) => void; className?: string; }

const emojis = ["👍", "❤️", "😂", "😮", "😢", "😡", "🎉", "🙏"];

export function ReactionPicker({ onSelect, className }: ReactionPickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild><Button variant="ghost" size="icon" className={className}><SmilePlus className="h-4 w-4" /></Button></PopoverTrigger>
      <PopoverContent className="w-auto p-2">
        <div className="flex gap-1">
          {emojis.map((emoji) => <button key={emoji} className="p-2 hover:bg-muted rounded text-xl" onClick={() => { onSelect(emoji); setOpen(false); }}>{emoji}</button>)}
        </div>
      </PopoverContent>
    </Popover>
  );
}
export default ReactionPicker;
