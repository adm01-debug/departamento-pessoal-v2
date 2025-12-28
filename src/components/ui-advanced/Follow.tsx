import React from 'react';
import { cn } from '@/lib/utils';

interface FollowProps { className?: string; children?: React.ReactNode; }

/**
 * Botão de seguir
 */
export const Follow: React.FC<FollowProps> = ({ className, children }) => {
  return <div className={cn('ui-component', className)}>{children}</div>;
};

export default Follow;
