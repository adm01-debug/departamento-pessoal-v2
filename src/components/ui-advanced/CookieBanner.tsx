import React from 'react';
import { cn } from '@/lib/utils';

interface CookieBannerProps { className?: string; children?: React.ReactNode; }

/**
 * Banner de cookies
 */
export const CookieBanner: React.FC<CookieBannerProps> = ({ className, children }) => {
  return <div className={cn('ui-component', className)}>{children}</div>;
};

export default CookieBanner;
