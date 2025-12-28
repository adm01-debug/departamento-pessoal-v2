import React from 'react';

interface PrintFooterProps {
  title?: string;
  showLogo?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function PrintFooter({ title, showLogo = true, className, children }: PrintFooterProps) {
  return (
    <div className={`print-only ${className || ''}`}>
      {showLogo && <img src="/logo.png" alt="Logo" className="h-8" />}
      {title && <h1 className="text-xl font-bold">{title}</h1>}
      {children}
    </div>
  );
}

export default PrintFooter;
