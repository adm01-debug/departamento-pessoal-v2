import { z } from "zod";
export const s2231Schema = z.object({
  ideEvento: z.object({ indRetif: z.enum(["1","2"]), nrRecibo: z.string().optional(), tpAmb: z.enum(["1","2"]), procEmi: z.enum(["1","2","3"]), verProc: z.string() }),
  ideEmpregador: z.object({ tpInsc: z.enum(["1","2"]), nrInsc: z.string() }),
  ideVinculo: z.object({ cpfTrab: z.string().length(11), matricula: z.string().max(30) }),
  infoCessao: z.object({
    iniCessao: z.object({ dtIniCessao: z.string(), cnpjCess: z.string().length(14), respRemun: z.enum(["1","2","3"]) }).optional(),
    fimCessao: z.object({ dtTermCessao: z.string() }).optional(),
  }),
});
export type S2231Data = z.infer<typeof s2231Schema>;
export function gerarXmlS2231(data: S2231Data): string {
  return `<?xml version="1.0" encoding="UTF-8"?><eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtCessao/v_S_01_01_00"><evtCessao><ideEvento><indRetif>${data.ideEvento.indRetif}</indRetif><tpAmb>${data.ideEvento.tpAmb}</tpAmb><procEmi>${data.ideEvento.procEmi}</procEmi><verProc>${data.ideEvento.verProc}</verProc></ideEvento><ideEmpregador><tpInsc>${data.ideEmpregador.tpInsc}</tpInsc><nrInsc>${data.ideEmpregador.nrInsc}</nrInsc></ideEmpregador><ideVinculo><cpfTrab>${data.ideVinculo.cpfTrab}</cpfTrab><matricula>${data.ideVinculo.matricula}</matricula></ideVinculo><infoCessao>${data.infoCessao.iniCessao ? `<iniCessao><dtIniCessao>${data.infoCessao.iniCessao.dtIniCessao}</dtIniCessao><cnpjCess>${data.infoCessao.iniCessao.cnpjCess}</cnpjCess><respRemun>${data.infoCessao.iniCessao.respRemun}</respRemun></iniCessao>` : ''}${data.infoCessao.fimCessao ? `<fimCessao><dtTermCessao>${data.infoCessao.fimCessao.dtTermCessao}</dtTermCessao></fimCessao>` : ''}</infoCessao></evtCessao></eSocial>`;
}
export default s2231Schema;
