import { z } from "zod";
export const s2416Schema = z.object({
  ideEvento: z.object({ indRetif: z.enum(["1","2"]), tpAmb: z.enum(["1","2"]), procEmi: z.enum(["1","2","3"]), verProc: z.string() }),
  ideEmpregador: z.object({ tpInsc: z.enum(["1","2"]), nrInsc: z.string() }),
  ideBenef: z.object({ cpfBenef: z.string().length(11), nrBeneficio: z.string() }),
  alteracao: z.object({ dtAltBenef: z.string(), vrBenef: z.number().optional(), tpBenef: z.string().optional() }),
});
export type S2416Data = z.infer<typeof s2416Schema>;
export function gerarXmlS2416(data: S2416Data): string { return `<?xml version="1.0"?><eSocial><evtAltBenIn></evtAltBenIn></eSocial>`; }
export default s2416Schema;
