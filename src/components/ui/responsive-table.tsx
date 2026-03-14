import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ResponsiveTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  renderCard: (item: T, index: number) => ReactNode;
  className?: string;
  loading?: boolean;
}

interface ColumnDef<T> {
  key: string;
  header: string;
  render: (item: T) => ReactNode;
  className?: string;
}

export function ResponsiveTable<T extends { id?: string }>({
  data,
  columns,
  renderCard,
  className,
  loading,
}: ResponsiveTableProps<T>) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="h-20 rounded-xl bg-muted/50 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-border/30">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/30 bg-muted/30">
              {columns.map(col => (
                <th
                  key={col.key}
                  className={cn('text-left text-overline font-body text-muted-foreground px-4 py-3', col.className)}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {data.map((item, i) => (
                <motion.tr
                  key={item.id || i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-border/20 hover:bg-accent/30 transition-colors"
                >
                  {columns.map(col => (
                    <td key={col.key} className={cn('px-4 py-3 text-body font-body', col.className)}>
                      {col.render(item)}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Mobile Card List */}
      <div className="md:hidden space-y-3">
        <AnimatePresence>
          {data.map((item, i) => (
            <motion.div
              key={item.id || i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: i * 0.05 }}
            >
              {renderCard(item, i)}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
