import { z } from "zod";
export const s2298Schema = z.object({
  ideEvento: z.object({ indRetif: z.enum(["1","2"]), nrRecibo: z.string().optional(), tpAmb: z.enum(["1","2"]), procEmi: z.enum(["1","2","3"]), verProc: z.string() }),
  ideEmpregador: z.object({ tpInsc: z.enum(["1","2"]), nrInsc: z.string() }),
  ideVinculo: z.object({ cpfTrab: z.string().length(11), matricula: z.string().max(30) }),
  infoReintegr: z.object({ tpReint: z.enum(["1","2","3","4","5","6","7","8","9"]), nrProcJud: z.string().max(20).optional(), nrLeiAnistia: z.string().max(13).optional(), dtEfetRetorno: z.string(), dtEfeito: z.string(), indPagtoJuizo: z.enum(["S","N"]).optional() }),
});
export type S2298Data = z.infer<typeof s2298Schema>;
export function gerarXmlS2298(data: S2298Data): string {
  return `<?xml version="1.0" encoding="UTF-8"?><eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtReintegr/v_S_01_01_00"><evtReintegr><ideEvento><indRetif>${data.ideEvento.indRetif}</indRetif><tpAmb>${data.ideEvento.tpAmb}</tpAmb><procEmi>${data.ideEvento.procEmi}</procEmi><verProc>${data.ideEvento.verProc}</verProc></ideEvento><ideEmpregador><tpInsc>${data.ideEmpregador.tpInsc}</tpInsc><nrInsc>${data.ideEmpregador.nrInsc}</nrInsc></ideEmpregador><ideVinculo><cpfTrab>${data.ideVinculo.cpfTrab}</cpfTrab><matricula>${data.ideVinculo.matricula}</matricula></ideVinculo><infoReintegr><tpReint>${data.infoReintegr.tpReint}</tpReint><dtEfetRetorno>${data.infoReintegr.dtEfetRetorno}</dtEfetRetorno><dtEfeito>${data.infoReintegr.dtEfeito}</dtEfeito></infoReintegr></evtReintegr></eSocial>`;
}
export default s2298Schema;
