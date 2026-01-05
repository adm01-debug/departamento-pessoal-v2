import { z } from "zod";
export const s2405Schema = z.object({
  ideEvento: z.object({ indRetif: z.enum(["1","2"]), tpAmb: z.enum(["1","2"]), procEmi: z.enum(["1","2","3"]), verProc: z.string() }),
  ideEmpregador: z.object({ tpInsc: z.enum(["1","2"]), nrInsc: z.string() }),
  ideBenef: z.object({ cpfBenef: z.string().length(11), nmBenef: z.string().max(70) }),
  alteracao: z.object({ dtAltBenef: z.string(), dadosBenef: z.object({ tpBenef: z.string(), vrBenef: z.number() }) }),
});
export type S2405Data = z.infer<typeof s2405Schema>;
export function gerarXmlS2405(data: S2405Data): string { return `<?xml version="1.0"?><eSocial><evtAltCadBenef></evtAltCadBenef></eSocial>`; }
export default s2405Schema;
