// V20-TYPE004: Beneficios Types
export interface Beneficio {
  id: string;
  colaboradorId: string;
  tipo: "VT" | "VA" | "VR" | "PLANO_SAUDE" | "PLANO_ODONTO" | "SEGURO_VIDA";
  valor: number;
  desconto: number;
  ativo: boolean;
}
export interface ValeTransporte extends Beneficio {
  tipo: "VT";
  linhas: LinhaTransporte[];
}
export interface LinhaTransporte {
  empresa: string;
  linha: string;
  valorPassagem: number;
  qtdDiaria: number;
}
