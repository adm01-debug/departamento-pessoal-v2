import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
interface BreadcrumbItem { label: string; href?: string; }
interface BreadcrumbProps { items: BreadcrumbItem[]; }
export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4"><Link to="/" className="hover:text-foreground"><Home className="h-4 w-4" /></Link>{items.map((item, index) => (<React.Fragment key={index}><ChevronRight className="h-4 w-4" />{item.href ? <Link to={item.href} className="hover:text-foreground">{item.label}</Link> : <span className="text-foreground font-medium">{item.label}</span>}</React.Fragment>))}</nav>
  );
}
// eslint-disable-next-line react-refresh/only-export-components
export function useBreadcrumb() {
  const location = useLocation();
  const paths = location.pathname.split("/").filter(Boolean);
  const items: BreadcrumbItem[] = paths.map((path, index) => ({ label: path.charAt(0).toUpperCase() + path.slice(1), href: index < paths.length - 1 ? "/" + paths.slice(0, index + 1).join("/") : undefined }));
  return items;
}
export default Breadcrumb;
