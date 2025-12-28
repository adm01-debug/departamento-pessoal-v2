import React from 'react';
import { cn } from '@/lib/utils';

interface TagProps { className?: string; children?: React.ReactNode; }

/**
 * Tag selecionável
 */
export const Tag: React.FC<TagProps> = ({ className, children }) => {
  return <div className={cn('ui-component', className)}>{children}</div>;
};

export default Tag;
