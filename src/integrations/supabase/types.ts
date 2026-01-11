// V15-492
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];
export interface Database {
  public: {
    Tables: {
      colaboradores: { Row: { id: string; nome: string; cpf: string; created_at: string }; Insert: Omit<any, 'id' | 'created_at'>; Update: Partial<any> };
      empresas: { Row: { id: string; razao_social: string; cnpj: string; created_at: string }; Insert: Omit<any, 'id' | 'created_at'>; Update: Partial<any> };
      folhas_pagamento: { Row: { id: string; competencia: string; status: string; created_at: string }; Insert: Omit<any, 'id' | 'created_at'>; Update: Partial<any> };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
