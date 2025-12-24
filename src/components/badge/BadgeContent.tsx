import { memo } from "react";
interface BadgeContentProps { icon?: React.ReactNode; label: string; }
export const BadgeContent = memo(function BadgeContent({ icon, label }: BadgeContentProps) {
  return <span className="flex items-center gap-1">{icon}{label}</span>;
});
