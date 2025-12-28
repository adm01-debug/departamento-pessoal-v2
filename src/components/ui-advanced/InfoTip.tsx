import React from 'react';
import { cn } from '@/lib/utils';

interface InfoTipProps { className?: string; children?: React.ReactNode; }

/**
 * Dica de informação
 */
export const InfoTip: React.FC<InfoTipProps> = ({ className, children }) => {
  return <div className={cn('ui-component', className)}>{children}</div>;
};

export default InfoTip;
