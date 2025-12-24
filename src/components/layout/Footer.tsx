import { memo } from "react";
interface FooterProps { children?: React.ReactNode; }
export const Footer = memo(function Footer({ children }: FooterProps) {
  return <footer className="border-t py-4 text-center text-sm text-muted-foreground">{children || "© 2024 Sistema RH"}</footer>;
});
