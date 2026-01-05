export interface GovBrConfig { clientId: string; clientSecret: string; redirectUri: string; ambiente: "PRODUCAO" | "HOMOLOGACAO"; }
export interface GovBrUser { cpf: string; nome: string; email?: string; telefone?: string; nivelConfiabilidade: number; }
export class GovBrService {
  private config: GovBrConfig;
  constructor(config: GovBrConfig) { this.config = config; }
  getAuthUrl(state: string): string { const base = this.config.ambiente === "PRODUCAO" ? "https://sso.acesso.gov.br" : "https://sso.staging.acesso.gov.br"; return `${base}/authorize?response_type=code&client_id=${this.config.clientId}&redirect_uri=${encodeURIComponent(this.config.redirectUri)}&scope=openid+email+phone+profile+govbr_confiabilidades&state=${state}`; }
  async getToken(code: string): Promise<{ accessToken: string; refreshToken: string }> { return { accessToken: "", refreshToken: "" }; }
  async getUserInfo(accessToken: string): Promise<GovBrUser> { return { cpf: "", nome: "", nivelConfiabilidade: 0 }; }
  async validarCPF(cpf: string): Promise<boolean> { return true; }
}
export default GovBrService;
