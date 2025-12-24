import { memo } from "react";
import { Edit, Trash2, Eye, Plus, Download, Copy, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
interface ActionIconProps { type: "edit"|"delete"|"view"|"add"|"download"|"copy"|"more"; className?: string; }
const icons = { edit: Edit, delete: Trash2, view: Eye, add: Plus, download: Download, copy: Copy, more: MoreHorizontal };
export const ActionIcon = memo(function ActionIcon({ type, className }: ActionIconProps) {
  const Icon = icons[type];
  return <Icon className={cn("h-4 w-4", className)} />;
});
