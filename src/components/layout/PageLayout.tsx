import { cn } from '@/lib/utils';
import { Spinner } from '@/components/ui/spinner';
import { motion } from 'framer-motion';

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  loading?: boolean;
  className?: string;
  icon?: React.ReactNode;
  gradient?: string;
}

export function PageLayout({ children, title, description, actions, loading, className, icon, gradient = 'from-primary to-primary-glow' }: PageLayoutProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('space-y-6 max-w-[1400px] mx-auto', className)}
    >
      {(title || actions) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {icon && (
              <div className={cn('p-2.5 rounded-xl bg-gradient-to-br shadow-lg', gradient)}>
                {icon}
              </div>
            )}
            <div>
              {title && <h1 className="text-2xl font-display font-bold tracking-tight">{title}</h1>}
              {description && <p className="text-muted-foreground font-body mt-0.5">{description}</p>}
            </div>
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </motion.div>
  );
}
