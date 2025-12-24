import { memo } from 'react';
interface PrintLayoutProps { children: React.ReactNode; titulo?: string; }
export const PrintLayout = memo(function PrintLayout({ children, titulo }: PrintLayoutProps) {
  return (
    <div className="print:block hidden">
      {titulo && <h1 className="text-2xl font-bold mb-4 text-center">{titulo}</h1>}
      <div className="print:text-black">{children}</div>
    </div>
  );
});
