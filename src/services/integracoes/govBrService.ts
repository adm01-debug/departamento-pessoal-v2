export interface GovBrConfig { clientId: string; clientSecret: string; redirectUri: string; }
export class GovBrService {
  private config: GovBrConfig;
  constructor(config: GovBrConfig) { this.config = config; }
  getAuthUrl(): string { return `https://sso.acesso.gov.br/authorize?client_id=${this.config.clientId}&redirect_uri=${encodeURIComponent(this.config.redirectUri)}&response_type=code&scope=openid`; }
  async getToken(code: string): Promise<{ accessToken: string; refreshToken: string }> { return { accessToken: `token_${code}`, refreshToken: `refresh_${code}` }; }
  async getUserInfo(token: string): Promise<{ cpf: string; nome: string; email: string }> { return { cpf: "00000000000", nome: "Usuário", email: "usuario@email.com" }; }
}
export default GovBrService;
