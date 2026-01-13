// QA-FIX: esocialS3000Validator - Exclusão de Eventos
import { z } from "zod";

export const esocialS3000Schema = z.object({
  // Identificação do Evento
  ideEvento: z.object({
    indRetif: z.enum(["1", "2"]).describe("1-Original, 2-Retificação"),
    nrRecibo: z.string().optional().describe("Número do recibo para retificação"),
    tpAmb: z.enum(["1", "2"]).describe("1-Produção, 2-Produção Restrita"),
    procEmi: z.enum(["1", "2", "3"]).describe("Processo de emissão"),
    verProc: z.string().min(1).max(20).describe("Versão do processo"),
  }),

  // Identificação do Empregador
  ideEmpregador: z.object({
    tpInsc: z.enum(["1", "2"]).describe("1-CNPJ, 2-CPF"),
    nrInsc: z.string().min(8).max(14).describe("CNPJ/CPF do empregador"),
  }),

  // Informações do Evento de Exclusão
  infoExclusao: z.object({
    tpEvento: z.string().min(6).max(6).describe("Tipo do evento a ser excluído"),
    nrRecEvt: z.string().min(1).max(40).describe("Recibo do evento a ser excluído"),
    ideTrabalhador: z.object({
      cpfTrab: z.string().length(11).describe("CPF do trabalhador"),
    }).optional(),
    ideFolhaPagto: z.object({
      indApuracao: z.enum(["1", "2"]).describe("1-Mensal, 2-Anual"),
      perApur: z.string().min(4).max(7).describe("Período de apuração"),
    }).optional(),
  }),
});

export type ESocialS3000 = z.infer<typeof esocialS3000Schema>;

export function validateS3000(data: unknown): { success: boolean; errors?: string[] } {
  try {
    esocialS3000Schema.parse(data);
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map((e) => `${e.path.join(".")}: ${e.message}`),
      };
    }
    return { success: false, errors: ["Erro desconhecido na validação"] };
  }
}

export function gerarXmlS3000(data: ESocialS3000): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtExclusao/v_S_01_01_00">
  <evtExclusao Id="ID${Date.now()}">
    <ideEvento>
      <indRetif>${data.ideEvento.indRetif}</indRetif>
      <tpAmb>${data.ideEvento.tpAmb}</tpAmb>
      <procEmi>${data.ideEvento.procEmi}</procEmi>
      <verProc>${data.ideEvento.verProc}</verProc>
    </ideEvento>
    <ideEmpregador>
      <tpInsc>${data.ideEmpregador.tpInsc}</tpInsc>
      <nrInsc>${data.ideEmpregador.nrInsc}</nrInsc>
    </ideEmpregador>
    <infoExclusao>
      <tpEvento>${data.infoExclusao.tpEvento}</tpEvento>
      <nrRecEvt>${data.infoExclusao.nrRecEvt}</nrRecEvt>
    </infoExclusao>
  </evtExclusao>
</eSocial>`;
}

export default { esocialS3000Schema, validateS3000, gerarXmlS3000 };
