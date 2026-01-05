import { z } from "zod";
export const s2410Schema = z.object({
  ideEvento: z.object({ indRetif: z.enum(["1","2"]), tpAmb: z.enum(["1","2"]), procEmi: z.enum(["1","2","3"]), verProc: z.string() }),
  ideEmpregador: z.object({ tpInsc: z.enum(["1","2"]), nrInsc: z.string() }),
  beneficiario: z.object({ cpfBenef: z.string().length(11), nmBenef: z.string().max(70), dtNascBenef: z.string(), sexoBenef: z.enum(["M","F"]) }),
  infoBeneficio: z.object({ tpPlanRP: z.enum(["1","2","3"]), tpBenef: z.string(), dtIniBenef: z.string(), vrBenef: z.number() }),
});
export type S2410Data = z.infer<typeof s2410Schema>;
export function gerarXmlS2410(data: S2410Data): string { return `<?xml version="1.0"?><eSocial><evtCdBenIn></evtCdBenIn></eSocial>`; }
export default s2410Schema;
