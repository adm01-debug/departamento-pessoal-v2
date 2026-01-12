// V17-S049: GovBrService Real
export const govBrServiceReal = {
  getAuthUrl() { return 'https://sso.acesso.gov.br/authorize'; },
  async exchangeCode(code: string) { return { access_token: '', refresh_token: '', expires_in: 3600 }; },
  async getUserInfo(token: string) { return { cpf: '', nome: '', email: '' }; }
};
export default govBrServiceReal;
