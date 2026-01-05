export type TipoConta = "CORRENTE" | "POUPANCA" | "SALARIO";
export type TipoChavePix = "CPF" | "CNPJ" | "EMAIL" | "TELEFONE" | "ALEATORIA";
export interface DadosBancarios { id: string; colaboradorId: string; banco: string; codigoBanco: string; agencia: string; digitoAgencia?: string; conta: string; digitoConta?: string; tipoConta: TipoConta; chavePix?: string; tipoChavePix?: TipoChavePix; principal: boolean; ativo: boolean; }
export const BANCOS_PRINCIPAIS = [{ codigo: "001", nome: "Banco do Brasil" }, { codigo: "033", nome: "Santander" }, { codigo: "104", nome: "Caixa Econômica" }, { codigo: "237", nome: "Bradesco" }, { codigo: "341", nome: "Itaú" }, { codigo: "756", nome: "Sicoob" }, { codigo: "077", nome: "Inter" }, { codigo: "260", nome: "Nubank" }];
