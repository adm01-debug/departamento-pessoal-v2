// V18: Index de Calculadoras - Completo e Atualizado 2026
// Todas as calculadoras usam TABELA_2026

// Core - Impostos e Contribuições
export * from "./inss";
export * from "./irrf";
export * from "./fgts";

// Férias e 13º
export * from "./ferias";
export * from "./decimo13";

// Rescisão
export * from "./rescisao";
export * from "./avisoPrevio";
export * from "./multaFGTS";

// Adicionais
export * from "./horasExtras";
export * from "./adicionalNoturno";
export * from "./adicionalPericulosidade";
export * from "./adicionalInsalubridade";

// Descontos e Benefícios
export * from "./pensaoAlimenticia";
export * from "./valeTransporte";
export * from "./salarioFamilia";

// Banco de Horas e DSR
export * from "./bancoHoras";
export * from "./dsr";

// Médias e Provisões
export * from "./medias";
export * from "./provisoes";

// Gratificações e Comissões
export * from "./gratificacao";
export * from "./comissao";
export * from "./plr";

// Afastamentos
export * from "./salarioMaternidade";
export * from "./auxilioDoenca";

// Re-export constantes 2026 para conveniência
export { 
  SALARIO_MINIMO_2026,
  TETO_INSS_2026,
  TABELA_INSS_2026,
  TABELA_IRRF_2026,
  LIMITE_SALARIO_FAMILIA_2026,
  VALOR_COTA_SALARIO_FAMILIA_2026
} from "@/constants/tabelas.constants";
