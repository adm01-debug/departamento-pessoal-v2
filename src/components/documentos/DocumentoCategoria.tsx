import React from "react";
import { Badge } from "@/components/ui/badge";
import { FileText, UserCheck, Building, Briefcase, Heart, Shield, FileCheck, Folder } from "lucide-react";

type CategoriaDocumento = 
  | "admissao" | "contrato" | "pessoal" | "beneficios" 
  | "saude" | "ferias" | "folha" | "desligamento" | "outros";

interface DocumentoCategoriaProps {
  categoria: CategoriaDocumento;
  showIcon?: boolean;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

const categoriaConfig: Record<CategoriaDocumento, { 
  label: string; 
  icon: React.ElementType; 
  color: string;
  bgColor: string;
}> = {
  admissao: { label: "Admissão", icon: UserCheck, color: "text-green-700", bgColor: "bg-green-100" },
  contrato: { label: "Contrato", icon: FileCheck, color: "text-blue-700", bgColor: "bg-blue-100" },
  pessoal: { label: "Pessoal", icon: FileText, color: "text-gray-700", bgColor: "bg-gray-100" },
  beneficios: { label: "Benefícios", icon: Heart, color: "text-pink-700", bgColor: "bg-pink-100" },
  saude: { label: "Saúde", icon: Shield, color: "text-red-700", bgColor: "bg-red-100" },
  ferias: { label: "Férias", icon: Briefcase, color: "text-yellow-700", bgColor: "bg-yellow-100" },
  folha: { label: "Folha", icon: Building, color: "text-purple-700", bgColor: "bg-purple-100" },
  desligamento: { label: "Desligamento", icon: FileText, color: "text-orange-700", bgColor: "bg-orange-100" },
  outros: { label: "Outros", icon: Folder, color: "text-slate-700", bgColor: "bg-slate-100" }
};

export function DocumentoCategoria({ 
  categoria, 
  showIcon = true, 
  showLabel = true,
  size = "md" 
}: DocumentoCategoriaProps) {
  const config = categoriaConfig[categoria] || categoriaConfig.outros;
  const Icon = config.icon;
  
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5"
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  };

  return (
    <Badge 
      variant="secondary" 
      className={`${config.bgColor} ${config.color} ${sizeClasses[size]} font-medium`}
    >
      {showIcon && <Icon className={`${iconSizes[size]} ${showLabel ? "mr-1" : ""}`} />}
      {showLabel && config.label}
    </Badge>
  );
}

export function listarCategorias(): { value: CategoriaDocumento; label: string }[] {
  return Object.entries(categoriaConfig).map(([value, { label }]) => ({
    value: value as CategoriaDocumento,
    label
  }));
}

export function getCategoriaLabel(categoria: CategoriaDocumento): string {
  return categoriaConfig[categoria]?.label || "Outros";
}

export function getCategoriaIcon(categoria: CategoriaDocumento): React.ElementType {
  return categoriaConfig[categoria]?.icon || Folder;
}

export type { CategoriaDocumento };
export default DocumentoCategoria;
