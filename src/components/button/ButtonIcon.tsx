/**
 * @fileoverview Botão apenas com ícone
 * @module components/button/ButtonIcon
 */
import { memo, forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { LucideIcon } from 'lucide-react';

/** Props do ButtonIcon */
interface ButtonIconProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Ícone a exibir */
  icon: LucideIcon;
  /** Texto do tooltip (acessibilidade) */
  label: string;
  /** Variante do botão */
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  /** Tamanho do botão */
  size?: 'sm' | 'md' | 'lg';
}

/** Mapeamento de tamanhos */
const sizeStyles = {
  sm: { button: 'h-8 w-8', icon: 'h-4 w-4' },
  md: { button: 'h-9 w-9', icon: 'h-4 w-4' },
  lg: { button: 'h-10 w-10', icon: 'h-5 w-5' },
};

/**
 * Botão quadrado contendo apenas um ícone com tooltip
 * @param props - Propriedades do componente
 * @returns Elemento JSX do botão
 */
export const ButtonIcon = memo(forwardRef<HTMLButtonElement, ButtonIconProps>(
  function ButtonIcon({ icon: Icon, label, variant = 'ghost', size = 'md', className, ...props }, ref) {
    const styles = sizeStyles[size];

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              ref={ref}
              variant={variant}
              className={cn('p-0', styles.button, className)}
              aria-label={label}
              {...props}
            >
              <Icon className={styles.icon} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{label}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
));
