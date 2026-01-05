import { z } from "zod";
export const s1040Schema = z.object({
  ideEvento: z.object({ indRetif: z.enum(["1", "2"]), nrRecibo: z.string().optional(), tpAmb: z.enum(["1", "2"]), procEmi: z.enum(["1", "2", "3"]), verProc: z.string().max(20) }),
  ideEmpregador: z.object({ tpInsc: z.enum(["1", "2"]), nrInsc: z.string().max(14) }),
  infoFuncao: z.object({
    codFuncao: z.string().max(30),
    iniValid: z.string().regex(/^\d{4}-\d{2}$/),
    fimValid: z.string().regex(/^\d{4}-\d{2}$/).optional(),
    inclusao: z.object({ dscFuncao: z.string().max(100), codCargo: z.string().max(30).optional() }).optional(),
    alteracao: z.object({ dscFuncao: z.string().max(100), codCargo: z.string().max(30).optional(), novaValidade: z.object({ iniValid: z.string(), fimValid: z.string().optional() }).optional() }).optional(),
    exclusao: z.object({ ideCadastro: z.object({ codFuncao: z.string(), iniValid: z.string(), fimValid: z.string().optional() }) }).optional(),
  }),
});
export type S1040Data = z.infer<typeof s1040Schema>;
export function gerarXmlS1040(data: S1040Data): string {
  return `<?xml version="1.0" encoding="UTF-8"?><eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtTabFuncao/v_S_01_01_00"><evtTabFuncao><ideEvento><indRetif>${data.ideEvento.indRetif}</indRetif><tpAmb>${data.ideEvento.tpAmb}</tpAmb><procEmi>${data.ideEvento.procEmi}</procEmi><verProc>${data.ideEvento.verProc}</verProc></ideEvento><ideEmpregador><tpInsc>${data.ideEmpregador.tpInsc}</tpInsc><nrInsc>${data.ideEmpregador.nrInsc}</nrInsc></ideEmpregador><infoFuncao><codFuncao>${data.infoFuncao.codFuncao}</codFuncao><iniValid>${data.infoFuncao.iniValid}</iniValid>${data.infoFuncao.inclusao ? `<inclusao><dscFuncao>${data.infoFuncao.inclusao.dscFuncao}</dscFuncao></inclusao>` : ''}</infoFuncao></evtTabFuncao></eSocial>`;
}
export default s1040Schema;
