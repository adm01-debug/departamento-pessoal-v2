/**
 * @module Footer
 * @description Footer do layout principal
 * @category Layout
 */

import React from "react";
import { cn } from "@/lib/utils";

/**
 * Props do componente Footer
 */
interface FooterProps {
  /** Conteúdo do footer */
  children?: React.ReactNode;
  /** Mostrar informações padrão */
  showDefaults?: boolean;
  /** Ano para copyright */
  year?: number;
  /** Nome da empresa/app */
  companyName?: string;
  /** Versão do app */
  version?: string;
  /** Footer fixo no bottom */
  sticky?: boolean;
  /** Classes CSS adicionais */
  className?: string;
}

/**
 * Footer - Rodapé do layout
 *
 * @description Rodapé com informações de copyright,
 * versão e links úteis
 *
 * @example
 * ```tsx
 * <Footer />
 * <Footer companyName="Minha Empresa" year={2024} />
 * <Footer sticky>
 *   <CustomFooterContent />
 * </Footer>
 * ```
 */
export const Footer = React.memo(function Footer({
  children,
  showDefaults = true,
  year = new Date().getFullYear(),
  companyName = "Sistema RH",
  version,
  sticky = false,
  className,
}: FooterProps) {
  return (
    <footer
      className={cn(
        "border-t bg-background",
        sticky && "sticky bottom-0",
        className
      )}
    >
      <div className="container flex h-14 items-center justify-between px-4">
        {children ? (
          children
        ) : showDefaults ? (
          <>
            <p className="text-sm text-muted-foreground">
              © {year} {companyName}. Todos os direitos reservados.
            </p>
            {version && (
              <p className="text-xs text-muted-foreground">
                Versão {version}
              </p>
            )}
          </>
        ) : null}
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";

export default Footer;
export type { FooterProps };
