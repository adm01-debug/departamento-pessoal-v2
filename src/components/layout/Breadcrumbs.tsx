import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';

const routeLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  colaboradores: 'Colaboradores',
  novo: 'Novo',
  editar: 'Editar',
  empresas: 'Empresas',
  nova: 'Nova',
  folha: 'Folha de Pagamento',
  calcular: 'Calcular',
  ferias: 'Férias',
  ponto: 'Ponto Eletrônico',
  beneficios: 'Benefícios',
  relatorios: 'Relatórios',
  esocial: 'eSocial',
  configuracoes: 'Configurações',
  'design-system': 'Design System',
};

export function Breadcrumbs({ className }: { className?: string }) {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);

  if (segments.length <= 1) return null; // Don't show on top-level pages

  const crumbs = segments.map((seg, i) => {
    const path = '/' + segments.slice(0, i + 1).join('/');
    const isLast = i === segments.length - 1;
    // Skip UUID segments display but keep in path
    const isUuid = /^[0-9a-f]{8}-/.test(seg);
    const label = isUuid ? '...' : routeLabels[seg] || seg.charAt(0).toUpperCase() + seg.slice(1);

    return { path, label, isLast };
  });

  return (
    <motion.nav
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      className={cn('flex items-center gap-1 text-caption font-body', className)}
      aria-label="Breadcrumb"
    >
      <Link
        to="/dashboard"
        className="text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Home"
      >
        <Home className="h-3.5 w-3.5" />
      </Link>

      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1">
          <ChevronRight className="h-3 w-3 text-muted-foreground/50" />
          {crumb.isLast ? (
            <span className="text-foreground font-medium">{crumb.label}</span>
          ) : (
            <Link
              to={crumb.path}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </motion.nav>
  );
}
