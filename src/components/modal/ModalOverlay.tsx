import { memo } from "react";
interface ModalOverlayProps { onClick?: () => void; }
export const ModalOverlay = memo(function ModalOverlay({ onClick }: ModalOverlayProps) {
  return <div className="fixed inset-0 bg-black/50 z-40" onClick={onClick} />;
});
