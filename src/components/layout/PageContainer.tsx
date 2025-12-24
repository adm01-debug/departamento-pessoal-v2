import { memo } from "react";
interface PageContainerProps { children: React.ReactNode; title?: string; }
export const PageContainer = memo(function PageContainer({ children, title }: PageContainerProps) {
  return <div className="space-y-6">{title && <h1 className="text-2xl font-bold">{title}</h1>}{children}</div>;
});
