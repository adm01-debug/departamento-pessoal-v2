import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface DashboardHeaderProps {
  greeting: string;
  isLoading: boolean;
  onRefresh: () => void;
}

export function DashboardHeader({ greeting, isLoading, onRefresh }: DashboardHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div>
        <h1 className="text-display-xl sm:text-display font-display font-bold tracking-tight flex items-center gap-2">
          {greeting}! <span className="inline-block animate-fade-in">👋</span>
        </h1>
        <p className="text-body text-muted-foreground font-body mt-1">
          Aqui está o resumo do seu departamento pessoal
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onRefresh}
        disabled={isLoading}
        className="gap-2 self-start rounded-xl border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all font-body"
      >
        <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
        Atualizar dados
      </Button>
    </motion.div>
  );
}
