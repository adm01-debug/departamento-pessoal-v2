import React from 'react';
import { cn } from '@/lib/utils';

interface FileExplorerProps {
  className?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Explorador de arquivos
 * Componente UI avançado com variantes
 */
export const FileExplorer: React.FC<FileExplorerProps> = ({
  className,
  children,
  variant = 'default',
  size = 'md',
}) => {
  const variants = {
    default: 'bg-primary text-primary-foreground',
    outline: 'border border-input bg-background',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
  };

  const sizes = {
    sm: 'h-8 text-sm px-3',
    md: 'h-10 text-base px-4',
    lg: 'h-12 text-lg px-6',
  };

  return (
    <div className={cn('rounded-md', variants[variant], sizes[size], className)}>
      {children}
    </div>
  );
};

export default FileExplorer;
