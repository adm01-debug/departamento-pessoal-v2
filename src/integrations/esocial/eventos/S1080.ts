import { z } from "zod";
export const s1080Schema = z.object({
  ideEvento: z.object({ indRetif: z.enum(["1", "2"]), nrRecibo: z.string().optional(), tpAmb: z.enum(["1", "2"]), procEmi: z.enum(["1", "2", "3"]), verProc: z.string().max(20) }),
  ideEmpregador: z.object({ tpInsc: z.enum(["1", "2"]), nrInsc: z.string().max(14) }),
  infoOperPortuario: z.object({
    ideOperPortuario: z.object({ cnpjOpPortuario: z.string().length(14), iniValid: z.string().regex(/^\d{4}-\d{2}$/), fimValid: z.string().regex(/^\d{4}-\d{2}$/).optional() }),
    inclusao: z.object({ aliqRat: z.number().min(0).max(100), fap: z.number().min(0.5).max(2).optional(), aliqRatAjust: z.number().optional() }).optional(),
    alteracao: z.object({ aliqRat: z.number().min(0).max(100), fap: z.number().min(0.5).max(2).optional(), aliqRatAjust: z.number().optional(), novaValidade: z.object({ iniValid: z.string(), fimValid: z.string().optional() }).optional() }).optional(),
    exclusao: z.object({ ideCadastro: z.object({ cnpjOpPortuario: z.string(), iniValid: z.string() }) }).optional(),
  }),
});
export type S1080Data = z.infer<typeof s1080Schema>;
export function gerarXmlS1080(data: S1080Data): string {
  return `<?xml version="1.0" encoding="UTF-8"?><eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtTabOperPort/v_S_01_01_00"><evtTabOperPort><ideEvento><indRetif>${data.ideEvento.indRetif}</indRetif><tpAmb>${data.ideEvento.tpAmb}</tpAmb><procEmi>${data.ideEvento.procEmi}</procEmi><verProc>${data.ideEvento.verProc}</verProc></ideEvento><ideEmpregador><tpInsc>${data.ideEmpregador.tpInsc}</tpInsc><nrInsc>${data.ideEmpregador.nrInsc}</nrInsc></ideEmpregador><infoOperPortuario><ideOperPortuario><cnpjOpPortuario>${data.infoOperPortuario.ideOperPortuario.cnpjOpPortuario}</cnpjOpPortuario><iniValid>${data.infoOperPortuario.ideOperPortuario.iniValid}</iniValid></ideOperPortuario></infoOperPortuario></evtTabOperPort></eSocial>`;
}
export default s1080Schema;
