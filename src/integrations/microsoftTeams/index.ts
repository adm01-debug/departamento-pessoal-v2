// V14-073: microsoftTeams/index.ts
export interface TeamsConfig {
  clientId: string;
  clientSecret: string;
  tenantId: string;
  webhookUrl?: string;
}

export interface TeamsMessage {
  title?: string;
  text: string;
  themeColor?: string;
  sections?: Array<{
    activityTitle?: string;
    activitySubtitle?: string;
    activityImage?: string;
    facts?: Array<{ name: string; value: string }>;
    text?: string;
  }>;
  potentialAction?: Array<{
    "@type": string;
    name: string;
    targets: Array<{ os: string; uri: string }>;
  }>;
}

export class MicrosoftTeamsIntegration {
  private config: TeamsConfig;

  constructor(config: TeamsConfig) {
    this.config = config;
  }

  async sendWebhookMessage(message: TeamsMessage): Promise<boolean> {
    if (!this.config.webhookUrl) throw new Error("Webhook URL not configured");
    const payload = { "@type": "MessageCard", "@context": "http://schema.org/extensions", ...message };
    const response = await fetch(this.config.webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return response.ok;
  }

  createNotificationCard(title: string, message: string, facts: Array<{ name: string; value: string }> = []): TeamsMessage {
    return {
      title,
      text: message,
      themeColor: "0076D7",
      sections: facts.length > 0 ? [{ facts }] : undefined,
    };
  }

  createAlertCard(title: string, message: string, severity: "info" | "warning" | "error" = "info"): TeamsMessage {
    const colors = { info: "0076D7", warning: "FFC107", error: "DC3545" };
    return { title: `⚠️ ${title}`, text: message, themeColor: colors[severity] };
  }

  async notifyNewEmployee(name: string, department: string, startDate: string): Promise<boolean> {
    const message = this.createNotificationCard("Novo Colaborador", `${name} ingressou na empresa!`, [
      { name: "Departamento", value: department },
      { name: "Data de Início", value: startDate },
    ]);
    return this.sendWebhookMessage(message);
  }

  async notifyPayrollProcessed(competencia: string, totalColaboradores: number, totalLiquido: string): Promise<boolean> {
    const message = this.createNotificationCard("Folha Processada", `Folha de ${competencia} finalizada`, [
      { name: "Colaboradores", value: String(totalColaboradores) },
      { name: "Total Líquido", value: totalLiquido },
    ]);
    return this.sendWebhookMessage(message);
  }
}

export const createTeamsIntegration = (config: TeamsConfig) => new MicrosoftTeamsIntegration(config);

