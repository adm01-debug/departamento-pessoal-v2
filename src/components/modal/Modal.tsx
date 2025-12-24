import { memo } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
interface ModalProps { open: boolean; onOpenChange: (o: boolean) => void; children: React.ReactNode; }
export const Modal = memo(function Modal({ open, onOpenChange, children }: ModalProps) {
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent>{children}</DialogContent></Dialog>;
});
