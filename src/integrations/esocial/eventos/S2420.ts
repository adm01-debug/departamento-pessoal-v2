import { z } from "zod";
export const s2420Schema = z.object({
  ideEvento: z.object({ indRetif: z.enum(["1","2"]), tpAmb: z.enum(["1","2"]), procEmi: z.enum(["1","2","3"]), verProc: z.string() }),
  ideEmpregador: z.object({ tpInsc: z.enum(["1","2"]), nrInsc: z.string() }),
  ideBenef: z.object({ cpfBenef: z.string().length(11), nrBeneficio: z.string() }),
  infoBenTermino: z.object({ dtTermBenef: z.string(), mtvTermino: z.enum(["01","02","03","04","05","06","07","08","09","99"]) }),
});
export type S2420Data = z.infer<typeof s2420Schema>;
export function gerarXmlS2420(data: S2420Data): string { return `<?xml version="1.0"?><eSocial><evtCdBenTerm></evtCdBenTerm></eSocial>`; }
export default s2420Schema;
