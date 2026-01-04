export interface Onboarding {
  id: string;
  nome: string;
  descricao?: string;
  codigo?: string;
  status: "ativo" | "inativo" | "pendente";
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}
export interface OnboardingCreate extends Omit<Onboarding, "id" | "createdAt" | "updatedAt"> {}
export interface OnboardingUpdate extends Partial<OnboardingCreate> {}
export interface OnboardingFilter { search?: string; status?: string; page?: number; limit?: number; }
export type OnboardingStatus = "ativo" | "inativo" | "pendente";
