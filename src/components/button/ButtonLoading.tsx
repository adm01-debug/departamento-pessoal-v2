/**
 * @fileoverview Botão com estado de carregamento
 * @module components/button/ButtonLoading
 */
import { memo, forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

/** Props do ButtonLoading */
interface ButtonLoadingProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Se está carregando */
  loading?: boolean;
  /** Texto durante carregamento */
  loadingText?: string;
  /** Conteúdo do botão */
  children: ReactNode;
  /** Variante do botão */
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  /** Tamanho do botão */
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

/**
 * Botão que exibe spinner durante carregamento
 * @param props - Propriedades do componente
 * @returns Elemento JSX do botão
 */
export const ButtonLoading = memo(forwardRef<HTMLButtonElement, ButtonLoadingProps>(
  function ButtonLoading({
    loading = false,
    loadingText,
    children,
    variant = 'default',
    size = 'default',
    disabled,
    className,
    ...props
  }, ref) {
    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        disabled={loading || disabled}
        className={cn('relative', className)}
        {...props}
      >
        {loading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {loading ? (loadingText || children) : children}
      </Button>
    );
  }
));
