import { memo } from "react";
interface BadgeContentProps { icon?: React.ReactNode; text: string; }
export const BadgeContent = memo(function BadgeContent({ icon, text }: BadgeContentProps) {
  return <span className="flex items-center gap-1">{icon}{text}</span>;
});
