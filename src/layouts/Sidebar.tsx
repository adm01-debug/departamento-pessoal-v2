import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Users, DollarSign, Calendar, Clock, Gift, FileText,
  Settings, Shield, ChevronDown, ChevronRight, Building2, Briefcase
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  children?: { label: string; href: string }[];
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Colaboradores", href: "/colaboradores", icon: Users },
  { label: "Folha de Pagamento", href: "/folha", icon: DollarSign },
  { label: "Férias", href: "/ferias", icon: Calendar },
  { label: "Ponto", href: "/ponto", icon: Clock },
  { label: "Benefícios", href: "/beneficios", icon: Gift },
  { label: "eSocial", href: "/esocial", icon: Shield },
  { label: "Relatórios", href: "/relatorios", icon: FileText },
  { label: "Cargos", href: "/cargos", icon: Briefcase },
  { label: "Departamentos", href: "/departamentos", icon: Building2 },
  { label: "Configurações", href: "/configuracoes", icon: Settings },
];

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ collapsed = false }: SidebarProps) {
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((i) => i !== label) : [...prev, label]
    );
  };

  return (
    <aside className={cn(
      "flex flex-col h-screen bg-card border-r transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex items-center h-16 px-4 border-b">
        {!collapsed && (
          <h1 className="text-xl font-bold text-primary">DP System</h1>
        )}
      </div>
      <nav className="flex-1 overflow-y-auto p-2">
        {navItems.map((item) => (
          <div key={item.label}>
            {item.children ? (
              <>
                <button
                  onClick={() => toggleExpand(item.label)}
                  className={cn(
                    "flex items-center w-full gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    "hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left">{item.label}</span>
                      {expandedItems.includes(item.label) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </>
                  )}
                </button>
                {!collapsed && expandedItems.includes(item.label) && (
                  <div className="ml-8 space-y-1">
                    {item.children.map((child) => (
                      <NavLink
                        key={child.href}
                        to={child.href}
                        className={({ isActive }) =>
                          cn(
                            "block px-3 py-2 rounded-md text-sm transition-colors",
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-accent hover:text-accent-foreground"
                          )
                        }
                      >
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent hover:text-accent-foreground"
                  )
                }
              >
                <item.icon className="h-5 w-5" />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
