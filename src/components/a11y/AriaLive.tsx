import { forwardRef } from 'react';
interface AriaLiveProps extends React.HTMLAttributes<HTMLDivElement> { mode?: 'polite' | 'assertive' | 'off'; atomic?: boolean; relevant?: 'additions' | 'removals' | 'text' | 'all'; }
export const AriaLive = forwardRef<HTMLDivElement, AriaLiveProps>(({ mode = 'polite', atomic = true, relevant = 'additions', children, ...props }, ref) => (
  <div ref={ref} aria-live={mode} aria-atomic={atomic} aria-relevant={relevant} {...props}>{children}</div>
));
AriaLive.displayName = 'AriaLive';
