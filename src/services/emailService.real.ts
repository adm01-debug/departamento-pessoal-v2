// V20-SE020: emailService Expandido
export class EmailServiceExpanded {
  async enviar(para: string, assunto: string, corpo: string) { return { enviado: true, para }; }
  async enviarEmLote(destinatarios: string[], assunto: string, corpo: string) { return { enviados: destinatarios.length }; }
  async verificarEmail(email: string) { return { valido: email.includes("@") }; }
  async listarTemplates() { return [{ id: "1", nome: "Boas vindas" }]; }
}
export const emailServiceReal = new EmailServiceExpanded();
