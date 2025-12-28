import React from 'react';
import { cn } from '@/lib/utils';

interface MentionProps { className?: string; children?: React.ReactNode; }

/**
 * Menção de usuário
 */
export const Mention: React.FC<MentionProps> = ({ className, children }) => {
  return <div className={cn('ui-component', className)}>{children}</div>;
};

export default Mention;
