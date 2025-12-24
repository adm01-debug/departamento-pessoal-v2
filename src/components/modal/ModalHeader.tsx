import { memo } from "react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
interface ModalHeaderProps { title: string; }
export const ModalHeader = memo(function ModalHeader({ title }: ModalHeaderProps) {
  return <DialogHeader><DialogTitle>{title}</DialogTitle></DialogHeader>;
});
