/**
 * @fileoverview Cabeçalho de página
 * @module components/common/PageHeader
 */
import { memo } from 'react';

interface PageHeaderProps { titulo: string; subtitulo?: string; children?: React.ReactNode; }

export const PageHeader = memo(function PageHeader({ titulo, subtitulo, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{titulo}</h1>
        {subtitulo && <p className="text-muted-foreground">{subtitulo}</p>}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
});
