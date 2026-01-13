// V20-A11Y001: Skip Navigation Component
import React from "react";

interface SkipNavLinkProps {
  contentId?: string;
  children?: React.ReactNode;
}

export const SkipNavLink: React.FC<SkipNavLinkProps> = ({
  contentId = "main-content",
  children = "Pular para o conteúdo principal"
}) => {
  return (
    <a
      href={`#${contentId}`}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
    >
      {children}
    </a>
  );
};

export const SkipNavContent: React.FC<{ id?: string; children: React.ReactNode }> = ({
  id = "main-content",
  children
}) => {
  return (
    <main id={id} tabIndex={-1} className="outline-none">
      {children}
    </main>
  );
};

export default SkipNavLink;
