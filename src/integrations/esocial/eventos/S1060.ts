import { z } from "zod";
export const s1060Schema = z.object({
  ideEvento: z.object({ indRetif: z.enum(["1", "2"]), nrRecibo: z.string().optional(), tpAmb: z.enum(["1", "2"]), procEmi: z.enum(["1", "2", "3"]), verProc: z.string().max(20) }),
  ideEmpregador: z.object({ tpInsc: z.enum(["1", "2"]), nrInsc: z.string().max(14) }),
  infoAmbiente: z.object({
    codAmb: z.string().max(30),
    iniValid: z.string().regex(/^\d{4}-\d{2}$/),
    fimValid: z.string().regex(/^\d{4}-\d{2}$/).optional(),
    inclusao: z.object({ nmAmb: z.string().max(100), dscAmb: z.string().max(8000).optional(), localAmb: z.enum(["1", "2"]), codLotacao: z.string().max(30).optional(), tpInsc: z.enum(["1", "2", "3", "4"]).optional(), nrInsc: z.string().optional() }).optional(),
    alteracao: z.object({ nmAmb: z.string().max(100), dscAmb: z.string().max(8000).optional(), localAmb: z.enum(["1", "2"]), codLotacao: z.string().max(30).optional() }).optional(),
    exclusao: z.object({ ideCadastro: z.object({ codAmb: z.string(), iniValid: z.string() }) }).optional(),
  }),
});
export type S1060Data = z.infer<typeof s1060Schema>;
export function gerarXmlS1060(data: S1060Data): string {
  return `<?xml version="1.0" encoding="UTF-8"?><eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtTabAmbiente/v_S_01_01_00"><evtTabAmbiente><ideEvento><indRetif>${data.ideEvento.indRetif}</indRetif><tpAmb>${data.ideEvento.tpAmb}</tpAmb><procEmi>${data.ideEvento.procEmi}</procEmi><verProc>${data.ideEvento.verProc}</verProc></ideEvento><ideEmpregador><tpInsc>${data.ideEmpregador.tpInsc}</tpInsc><nrInsc>${data.ideEmpregador.nrInsc}</nrInsc></ideEmpregador><infoAmbiente><codAmb>${data.infoAmbiente.codAmb}</codAmb><iniValid>${data.infoAmbiente.iniValid}</iniValid>${data.infoAmbiente.inclusao ? `<inclusao><nmAmb>${data.infoAmbiente.inclusao.nmAmb}</nmAmb><localAmb>${data.infoAmbiente.inclusao.localAmb}</localAmb></inclusao>` : ''}</infoAmbiente></evtTabAmbiente></eSocial>`;
}
export default s1060Schema;
