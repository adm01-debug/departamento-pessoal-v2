import React from 'react';
import { cn } from '@/lib/utils';

interface BookmarkProps { className?: string; children?: React.ReactNode; }

/**
 * Botão de marcar
 */
export const Bookmark: React.FC<BookmarkProps> = ({ className, children }) => {
  return <div className={cn('ui-component', className)}>{children}</div>;
};

export default Bookmark;
