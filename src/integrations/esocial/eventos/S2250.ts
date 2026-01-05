import { z } from "zod";
export const s2250Schema = z.object({
  ideEvento: z.object({ indRetif: z.enum(["1","2"]), nrRecibo: z.string().optional(), tpAmb: z.enum(["1","2"]), procEmi: z.enum(["1","2","3"]), verProc: z.string() }),
  ideEmpregador: z.object({ tpInsc: z.enum(["1","2"]), nrInsc: z.string() }),
  ideVinculo: z.object({ cpfTrab: z.string().length(11), matricula: z.string().max(30) }),
  infoAvPrevio: z.object({
    detAvPrevio: z.object({ dtAvPrv: z.string(), dtPrevDeslig: z.string(), tpAvPrevio: z.enum(["1","2","3"]), observacao: z.string().max(255).optional() }).optional(),
    cancAvPrevio: z.object({ dtCancAvPrv: z.string(), mtvCancAvPrevio: z.string().max(255).optional() }).optional(),
  }),
});
export type S2250Data = z.infer<typeof s2250Schema>;
export function gerarXmlS2250(data: S2250Data): string {
  return `<?xml version="1.0" encoding="UTF-8"?><eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtAvPrevio/v_S_01_01_00"><evtAvPrevio><ideEvento><indRetif>${data.ideEvento.indRetif}</indRetif><tpAmb>${data.ideEvento.tpAmb}</tpAmb><procEmi>${data.ideEvento.procEmi}</procEmi><verProc>${data.ideEvento.verProc}</verProc></ideEvento><ideEmpregador><tpInsc>${data.ideEmpregador.tpInsc}</tpInsc><nrInsc>${data.ideEmpregador.nrInsc}</nrInsc></ideEmpregador><ideVinculo><cpfTrab>${data.ideVinculo.cpfTrab}</cpfTrab><matricula>${data.ideVinculo.matricula}</matricula></ideVinculo><infoAvPrevio>${data.infoAvPrevio.detAvPrevio ? `<detAvPrevio><dtAvPrv>${data.infoAvPrevio.detAvPrevio.dtAvPrv}</dtAvPrv><dtPrevDeslig>${data.infoAvPrevio.detAvPrevio.dtPrevDeslig}</dtPrevDeslig><tpAvPrevio>${data.infoAvPrevio.detAvPrevio.tpAvPrevio}</tpAvPrevio></detAvPrevio>` : ''}</infoAvPrevio></evtAvPrevio></eSocial>`;
}
export default s2250Schema;
