import { z } from "zod";
export const s1035Schema = z.object({
  ideEvento: z.object({ indRetif: z.enum(["1", "2"]), nrRecibo: z.string().optional(), tpAmb: z.enum(["1", "2"]), procEmi: z.enum(["1", "2", "3"]), verProc: z.string().max(20) }),
  ideEmpregador: z.object({ tpInsc: z.enum(["1", "2"]), nrInsc: z.string().max(14) }),
  infoCarreira: z.object({
    codCarreira: z.string().max(30),
    iniValid: z.string().regex(/^\d{4}-\d{2}$/),
    fimValid: z.string().regex(/^\d{4}-\d{2}$/).optional(),
    inclusao: z.object({ dscCarreira: z.string().max(100), leiCarr: z.string().max(20).optional(), dtLeiCarr: z.string().optional(), sitCarr: z.enum(["1", "2"]) }).optional(),
    alteracao: z.object({ dscCarreira: z.string().max(100), leiCarr: z.string().max(20).optional(), dtLeiCarr: z.string().optional(), sitCarr: z.enum(["1", "2"]), novaValidade: z.object({ iniValid: z.string(), fimValid: z.string().optional() }).optional() }).optional(),
    exclusao: z.object({ ideCadastro: z.object({ codCarreira: z.string(), iniValid: z.string(), fimValid: z.string().optional() }) }).optional(),
  }),
});
export type S1035Data = z.infer<typeof s1035Schema>;
export function gerarXmlS1035(data: S1035Data): string {
  return `<?xml version="1.0" encoding="UTF-8"?><eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtTabCarreira/v_S_01_01_00"><evtTabCarreira><ideEvento><indRetif>${data.ideEvento.indRetif}</indRetif><tpAmb>${data.ideEvento.tpAmb}</tpAmb><procEmi>${data.ideEvento.procEmi}</procEmi><verProc>${data.ideEvento.verProc}</verProc></ideEvento><ideEmpregador><tpInsc>${data.ideEmpregador.tpInsc}</tpInsc><nrInsc>${data.ideEmpregador.nrInsc}</nrInsc></ideEmpregador><infoCarreira><codCarreira>${data.infoCarreira.codCarreira}</codCarreira><iniValid>${data.infoCarreira.iniValid}</iniValid>${data.infoCarreira.inclusao ? `<inclusao><dscCarreira>${data.infoCarreira.inclusao.dscCarreira}</dscCarreira><sitCarr>${data.infoCarreira.inclusao.sitCarr}</sitCarr></inclusao>` : ''}</infoCarreira></evtTabCarreira></eSocial>`;
}
export default s1035Schema;
