import { useState, useEffect } from "react";
type BreakpointKey = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
const breakpoints: Record<BreakpointKey, number> = { xs: 0, sm: 640, md: 768, lg: 1024, xl: 1280, "2xl": 1536 };
export function useBreakpoint() {
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 0);
  useEffect(() => { const handleResize = () => setWidth(window.innerWidth); window.addEventListener("resize", handleResize); return () => window.removeEventListener("resize", handleResize); }, []);
  const current: BreakpointKey = width >= breakpoints["2xl"] ? "2xl" : width >= breakpoints.xl ? "xl" : width >= breakpoints.lg ? "lg" : width >= breakpoints.md ? "md" : width >= breakpoints.sm ? "sm" : "xs";
  const isAbove = (bp: BreakpointKey) => width >= breakpoints[bp];
  const isBelow = (bp: BreakpointKey) => width < breakpoints[bp];
  const isMobile = width < breakpoints.md;
  const isTablet = width >= breakpoints.md && width < breakpoints.lg;
  const isDesktop = width >= breakpoints.lg;
  return { width, current, isAbove, isBelow, isMobile, isTablet, isDesktop };
}
export default useBreakpoint;
