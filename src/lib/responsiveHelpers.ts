export const isMobile = () => window.innerWidth < 768;
export const isTablet = () => window.innerWidth >= 768 && window.innerWidth < 1024;
export const isDesktop = () => window.innerWidth >= 1024;
export const getBreakpoint = () => { if (window.innerWidth < 640) return 'xs'; if (window.innerWidth < 768) return 'sm'; if (window.innerWidth < 1024) return 'md'; if (window.innerWidth < 1280) return 'lg'; return 'xl'; };
