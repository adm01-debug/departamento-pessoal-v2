import React from 'react';
import { cn } from '@/lib/utils';

interface ShareProps { className?: string; children?: React.ReactNode; }

/**
 * Botão de compartilhar
 */
export const Share: React.FC<ShareProps> = ({ className, children }) => {
  return <div className={cn('ui-component', className)}>{children}</div>;
};

export default Share;
