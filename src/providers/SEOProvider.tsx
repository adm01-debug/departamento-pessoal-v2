import React from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";
interface SEOProps { title?: string; description?: string; keywords?: string; image?: string; url?: string; }
export function SEOProvider({ children }: { children: React.ReactNode }) {
  return <HelmetProvider>{children}</HelmetProvider>;
}
export function SEO({ title = "Departamento Pessoal", description = "Sistema de gestão de departamento pessoal", keywords = "DP, folha de pagamento, RH, recursos humanos", image, url }: SEOProps) {
  const fullTitle = title === "Departamento Pessoal" ? title : `${title} | Departamento Pessoal`;
  return (
    <Helmet><title>{fullTitle}</title><meta name="description" content={description} /><meta name="keywords" content={keywords} /><meta property="og:title" content={fullTitle} /><meta property="og:description" content={description} />{image && <meta property="og:image" content={image} />}{url && <meta property="og:url" content={url} />}<meta name="twitter:card" content="summary_large_image" /><meta name="twitter:title" content={fullTitle} /><meta name="twitter:description" content={description} /></Helmet>
  );
}
export default SEOProvider;
