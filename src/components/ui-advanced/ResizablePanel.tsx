import React from 'react';
import { cn } from '@/lib/utils';

interface ResizablePanelProps { className?: string; children?: React.ReactNode; }

/**
 * Painel redimensionável
 */
export const ResizablePanel: React.FC<ResizablePanelProps> = ({ className, children }) => {
  return <div className={cn('ui-component', className)}>{children}</div>;
};

export default ResizablePanel;
