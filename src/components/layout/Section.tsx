import { memo } from "react";
interface SectionProps { children: React.ReactNode; title?: string; className?: string; }
export const Section = memo(function Section({ children, title, className }: SectionProps) {
  return <section className={className || "space-y-4"}>{title && <h2 className="text-lg font-semibold">{title}</h2>}{children}</section>;
});
