import { memo, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { LucideIcon, FileQuestion, Users, FileText, Calendar, Clock, Gift, BarChart3, FileCheck, Building2 } from 'lucide-react';

interface ModuleEmptyStateProps {
  module: 'colaboradores' | 'empresas' | 'folha' | 'ferias' | 'ponto' | 'beneficios' | 'relatorios' | 'esocial' | 'default';
  action?: { label: string; onClick: () => void };
  className?: string;
}

const moduleConfig: Record<string, { 
  icon: LucideIcon; 
  title: string; 
  description: string; 
  gradient: string;
  illustration: string;
}> = {
  colaboradores: {
    icon: Users,
    title: 'Nenhum colaborador cadastrado',
    description: 'Cadastre seu primeiro colaborador para começar a gerenciar sua equipe, folha de pagamento e benefícios.',
    gradient: 'from-info to-level',
    illustration: '👥',
  },
  empresas: {
    icon: Building2,
    title: 'Nenhuma empresa cadastrada',
    description: 'Cadastre sua empresa para configurar dados fiscais, endereço e parâmetros de cálculo.',
    gradient: 'from-xp to-tasks',
    illustration: '🏢',
  },
  folha: {
    icon: FileText,
    title: 'Nenhuma folha processada',
    description: 'Processe sua primeira folha de pagamento. Cadastre colaboradores e configure os parâmetros antes.',
    gradient: 'from-finance to-success',
    illustration: '💰',
  },
  ferias: {
    icon: Calendar,
    title: 'Nenhuma férias registrada',
    description: 'As férias dos colaboradores aparecerão aqui após o cadastro. Configure os períodos aquisitivos.',
    gradient: 'from-warning to-coins',
    illustration: '🏖️',
  },
  ponto: {
    icon: Clock,
    title: 'Nenhum registro de ponto',
    description: 'Configure as jornadas de trabalho e comece a registrar o ponto dos colaboradores.',
    gradient: 'from-streak to-warning',
    illustration: '⏰',
  },
  beneficios: {
    icon: Gift,
    title: 'Nenhum benefício cadastrado',
    description: 'Configure vale-transporte, vale-alimentação, plano de saúde e outros benefícios.',
    gradient: 'from-xp to-store',
    illustration: '🎁',
  },
  relatorios: {
    icon: BarChart3,
    title: 'Nenhum relatório gerado',
    description: 'Gere relatórios detalhados de folha, férias, ponto e indicadores do departamento pessoal.',
    gradient: 'from-info to-primary',
    illustration: '📊',
  },
  esocial: {
    icon: FileCheck,
    title: 'Nenhum evento eSocial',
    description: 'Configure sua empresa e colaboradores para começar a transmitir eventos ao eSocial.',
    gradient: 'from-success to-finance',
    illustration: '📋',
  },
  default: {
    icon: FileQuestion,
    title: 'Nenhum dado encontrado',
    description: 'Não há registros para exibir. Comece adicionando novos dados.',
    gradient: 'from-muted-foreground to-foreground',
    illustration: '📭',
  },
};

export const ModuleEmptyState = memo(function ModuleEmptyState({ module, action, className }: ModuleEmptyStateProps) {
  const config = moduleConfig[module] || moduleConfig.default;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn(
        'relative flex flex-col items-center justify-center py-16 px-6 text-center',
        'rounded-2xl border border-dashed border-border/50',
        'bg-gradient-to-br from-card to-accent/10 overflow-hidden',
        className
      )}
    >
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-primary/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-info/5 to-transparent rounded-full translate-y-1/2 -translate-x-1/2" />

      {/* Illustration */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
        className="relative mb-6"
      >
        <div className={cn('p-6 rounded-3xl bg-gradient-to-br shadow-lg', config.gradient)}>
          <Icon className="h-10 w-10 text-primary-foreground" />
        </div>
        <span className="absolute -top-2 -right-2 text-3xl animate-float">{config.illustration}</span>
      </motion.div>

      <h3 className="text-h2 font-display font-bold mb-2 relative z-10">{config.title}</h3>
      <p className="text-body text-muted-foreground font-body max-w-md mb-6 relative z-10">
        {config.description}
      </p>

      {action && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            onClick={action.onClick}
            className={cn('gap-2 h-11 rounded-xl bg-gradient-to-r shadow-lg hover:opacity-90 transition-opacity font-body', config.gradient)}
          >
            {action.label}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
});
