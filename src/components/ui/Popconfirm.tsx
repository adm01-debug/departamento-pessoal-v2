import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface PopconfirmProps { trigger: React.ReactNode; title: string; description?: string; confirmLabel?: string; cancelLabel?: string; onConfirm: () => void; }

export function Popconfirm({ trigger, title, description, confirmLabel = "Confirmar", cancelLabel = "Cancelar", onConfirm }: PopconfirmProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="space-y-2">
          <p className="font-medium">{title}</p>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setOpen(false)}>{cancelLabel}</Button>
            <Button size="sm" onClick={() => { onConfirm(); setOpen(false); }}>{confirmLabel}</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
export default Popconfirm;
