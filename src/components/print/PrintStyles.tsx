import React from 'react';

interface PrintStylesProps {
  title?: string;
  showLogo?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function PrintStyles({ title, showLogo = true, className, children }: PrintStylesProps) {
  return (
    <div className={`print-only ${className || ''}`}>
      {showLogo && <img src="/logo.png" alt="Logo" className="h-8" />}
      {title && <h1 className="text-xl font-bold">{title}</h1>}
      {children}
    </div>
  );
}

export default PrintStyles;
