import { useMediaQuery } from '@/hooks/useMediaQuery';
interface ResponsiveProps { mobile: React.ReactNode; desktop: React.ReactNode; breakpoint?: number; }
export function Responsive({ mobile, desktop, breakpoint = 768 }: ResponsiveProps) {
  const isDesktop = useMediaQuery(`(min-width: ${breakpoint}px)`);
  return <>{isDesktop ? desktop : mobile}</>;
}
