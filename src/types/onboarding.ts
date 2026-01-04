// onboarding.ts - Type definitions

export interface Onboarding {
  id: string;
  nome: string;
  descricao?: string;
  codigo?: string;
  ativo: boolean;
  valor?: number;
  dataInicio?: string;
  dataFim?: string;
  observacoes?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface OnboardingCreate extends Omit<Onboarding, "id" | "createdAt" | "updatedAt"> {}

export interface OnboardingUpdate extends Partial<Omit<Onboarding, "id" | "createdAt">> {}

export interface OnboardingFilter {
  search?: string;
  ativo?: boolean;
  page?: number;
  limit?: number;
  orderBy?: string;
  order?: "asc" | "desc";
}

export interface OnboardingListResponse {
  data: Onboarding[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type OnboardingStatus = "ativo" | "inativo" | "pendente" | "aprovado" | "rejeitado" | "cancelado";

export function isOnboarding(obj: any): obj is Onboarding {
  return obj && typeof obj.id === "string" && typeof obj.nome === "string";
}
