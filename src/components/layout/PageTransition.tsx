import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { type ReactNode, useRef } from 'react';

/* ─── Contextual page transitions ─── */
const variants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 16 : -16,
    y: 4,
  }),
  center: {
    opacity: 1,
    x: 0,
    y: 0,
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -16 : 16,
    y: -4,
  }),
};

const transition = {
  type: 'tween' as const,
  ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
  duration: 0.22,
};

// Route hierarchy for determining direction
const routeOrder = [
  '/dashboard', '/colaboradores', '/admissoes', '/desligamentos',
  '/folha', '/ponto', '/ferias', '/afastamentos',
  '/beneficios', '/cargos', '/departamentos', '/documentos', '/feriados', '/organograma',
  '/relatorios', '/esocial', '/auditoria',
  '/usuarios', '/integracoes', '/backup', '/configuracoes',
];

function getRouteIndex(path: string): number {
  const base = '/' + path.split('/').filter(Boolean)[0];
  const idx = routeOrder.indexOf(base);
  return idx >= 0 ? idx : routeOrder.length;
}

interface PageTransitionProps {
  children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();
  const prevIndex = useRef(getRouteIndex(location.pathname));
  const currentIndex = getRouteIndex(location.pathname);
  const direction = currentIndex >= prevIndex.current ? 1 : -1;
  prevIndex.current = currentIndex;

  return (
    <AnimatePresence mode="wait" initial={false} custom={direction}>
      <motion.div
        key={location.pathname}
        custom={direction}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={transition}
        className="flex-1"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
