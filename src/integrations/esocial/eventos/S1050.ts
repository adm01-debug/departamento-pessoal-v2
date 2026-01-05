import { z } from "zod";
export const s1050Schema = z.object({
  ideEvento: z.object({ indRetif: z.enum(["1", "2"]), nrRecibo: z.string().optional(), tpAmb: z.enum(["1", "2"]), procEmi: z.enum(["1", "2", "3"]), verProc: z.string().max(20) }),
  ideEmpregador: z.object({ tpInsc: z.enum(["1", "2"]), nrInsc: z.string().max(14) }),
  infoHorContratual: z.object({
    codHorContrat: z.string().max(30),
    iniValid: z.string().regex(/^\d{4}-\d{2}$/),
    fimValid: z.string().regex(/^\d{4}-\d{2}$/).optional(),
    inclusao: z.object({
      horarioIntervalo: z.array(z.object({ dia: z.enum(["1","2","3","4","5","6","7"]), codHorContrat: z.string(), hrEntr: z.string(), hrSaida: z.string(), durJornada: z.number(), perHorFlworking: z.enum(["S","N"]).optional(), hrInterv: z.array(z.object({ tpInterv: z.enum(["1","2"]), durInterv: z.number(), iniInterv: z.string().optional(), termInterv: z.string().optional() })).optional() })),
    }).optional(),
  }),
});
export type S1050Data = z.infer<typeof s1050Schema>;
export function gerarXmlS1050(data: S1050Data): string {
  return `<?xml version="1.0" encoding="UTF-8"?><eSocial xmlns="http://www.esocial.gov.br/schema/evt/evtTabHorTur/v_S_01_01_00"><evtTabHorTur><ideEvento><indRetif>${data.ideEvento.indRetif}</indRetif><tpAmb>${data.ideEvento.tpAmb}</tpAmb><procEmi>${data.ideEvento.procEmi}</procEmi><verProc>${data.ideEvento.verProc}</verProc></ideEvento><ideEmpregador><tpInsc>${data.ideEmpregador.tpInsc}</tpInsc><nrInsc>${data.ideEmpregador.nrInsc}</nrInsc></ideEmpregador><infoHorContratual><codHorContrat>${data.infoHorContratual.codHorContrat}</codHorContrat><iniValid>${data.infoHorContratual.iniValid}</iniValid></infoHorContratual></evtTabHorTur></eSocial>`;
}
export default s1050Schema;
