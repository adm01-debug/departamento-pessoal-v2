// V14-077: slack/index.ts
export interface SlackConfig {
  botToken: string;
  signingSecret: string;
  webhookUrl?: string;
  defaultChannel?: string;
}

export interface SlackMessage {
  channel?: string;
  text: string;
  blocks?: SlackBlock[];
  attachments?: SlackAttachment[];
  thread_ts?: string;
  unfurl_links?: boolean;
  unfurl_media?: boolean;
}

export interface SlackBlock {
  type: "section" | "divider" | "header" | "context" | "actions";
  text?: { type: "plain_text" | "mrkdwn"; text: string; emoji?: boolean };
  fields?: Array<{ type: "plain_text" | "mrkdwn"; text: string }>;
  accessory?: { type: string; [key: string]: unknown };
  elements?: Array<{ type: string; [key: string]: unknown }>;
}

export interface SlackAttachment {
  color?: string;
  fallback?: string;
  title?: string;
  text?: string;
  fields?: Array<{ title: string; value: string; short?: boolean }>;
  footer?: string;
  ts?: number;
}

export class SlackIntegration {
  private config: SlackConfig;

  constructor(config: SlackConfig) {
    this.config = config;
  }

  async sendMessage(message: SlackMessage): Promise<{ ok: boolean; ts?: string; error?: string }> {
    const response = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: { Authorization: `Bearer ${this.config.botToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({ channel: message.channel || this.config.defaultChannel, ...message }),
    });
    return response.json();
  }

  async sendWebhook(message: SlackMessage): Promise<boolean> {
    if (!this.config.webhookUrl) throw new Error("Webhook URL not configured");
    const response = await fetch(this.config.webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    });
    return response.ok;
  }

  createNotificationMessage(title: string, message: string, fields: Array<{ title: string; value: string }> = []): SlackMessage {
    return {
      text: title,
      blocks: [
        { type: "header", text: { type: "plain_text", text: title, emoji: true } },
        { type: "section", text: { type: "mrkdwn", text: message } },
        ...(fields.length > 0 ? [{ type: "section" as const, fields: fields.map((f) => ({ type: "mrkdwn" as const, text: `*${f.title}*
${f.value}` })) }] : []),
      ],
    };
  }

  async notifyNewEmployee(name: string, department: string, manager: string): Promise<boolean> {
    const message = this.createNotificationMessage("🎉 Novo Colaborador", `Bem-vindo(a) *${name}*!`, [
      { title: "Departamento", value: department },
      { title: "Gestor", value: manager },
    ]);
    const result = await this.sendMessage(message);
    return result.ok;
  }

  async notifyPayrollReady(competencia: string, total: string): Promise<boolean> {
    const message = this.createNotificationMessage("💰 Folha Processada", `A folha de *${competencia}* foi processada.`, [
      { title: "Total Líquido", value: total },
    ]);
    const result = await this.sendMessage(message);
    return result.ok;
  }
}

export const createSlackIntegration = (config: SlackConfig) => new SlackIntegration(config);

