import { z } from "zod";
export const s2418Schema = z.object({
  ideEvento: z.object({ indRetif: z.enum(["1","2"]), tpAmb: z.enum(["1","2"]), procEmi: z.enum(["1","2","3"]), verProc: z.string() }),
  ideEmpregador: z.object({ tpInsc: z.enum(["1","2"]), nrInsc: z.string() }),
  ideBenef: z.object({ cpfBenef: z.string().length(11), nrBeneficio: z.string() }),
  infoRe662: z.object({ dtRe662: z.string(), mtvRe662: z.enum(["1","2","3"]) }),
});
export type S2418Data = z.infer<typeof s2418Schema>;
export function gerarXmlS2418(data: S2418Data): string { return `<?xml version="1.0"?><eSocial><evtRe662BenIn></evtReativ662BenIn></eSocial>`; }
export default s2418Schema;
