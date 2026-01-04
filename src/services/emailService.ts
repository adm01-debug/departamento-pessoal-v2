export interface EmailConfig {
  provider: "smtp" | "sendgrid" | "ses" | "mailgun";
  from: { name: string; email: string };
  replyTo?: string;
}

export interface EmailMessage {
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject: string;
  html?: string;
  text?: string;
  attachments?: { filename: string; content: string | Buffer; contentType?: string }[];
  templateId?: string;
  templateData?: Record<string, any>;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  html: string;
  variables: string[];
}

const templates: Record<string, EmailTemplate> = {
  welcome: { id: "welcome", name: "Boas-vindas", subject: "Bem-vindo à empresa!", html: "<h1>Olá {{nome}}!</h1><p>Bem-vindo à {{empresa}}.</p>", variables: ["nome", "empresa"] },
  ferias_aprovadas: { id: "ferias_aprovadas", name: "Férias Aprovadas", subject: "Suas férias foram aprovadas", html: "<h1>{{nome}}</h1><p>Suas férias de {{inicio}} a {{fim}} foram aprovadas.</p>", variables: ["nome", "inicio", "fim"] },
  holerite: { id: "holerite", name: "Holerite Disponível", subject: "Holerite {{competencia}} disponível", html: "<p>Olá {{nome}}, seu holerite de {{competencia}} está disponível.</p>", variables: ["nome", "competencia"] },
  rescisao: { id: "rescisao", name: "Rescisão", subject: "Documentos de Rescisão", html: "<p>{{nome}}, seguem os documentos da sua rescisão.</p>", variables: ["nome"] },
  aniversario: { id: "aniversario", name: "Aniversário", subject: "Feliz Aniversário! 🎂", html: "<h1>Parabéns {{nome}}!</h1><p>A equipe deseja um feliz aniversário!</p>", variables: ["nome"] },
};

class EmailService {
  private config: EmailConfig = { provider: "smtp", from: { name: "DP Sistema", email: "dp@empresa.com.br" } };
  private queue: { message: EmailMessage; attempts: number }[] = [];

  configure(config: Partial<EmailConfig>): void {
    this.config = { ...this.config, ...config };
  }

  async send(message: EmailMessage): Promise<EmailResult> {
    try {
      const recipients = Array.isArray(message.to) ? message.to : [message.to];
      console.log(`[Email] Sending to ${recipients.join(", ")}: ${message.subject}`);
      return { success: true, messageId: `msg_${Date.now()}` };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  async sendTemplate(templateId: string, to: string | string[], data: Record<string, any>): Promise<EmailResult> {
    const template = templates[templateId];
    if (!template) return { success: false, error: "Template not found" };

    let html = template.html;
    let subject = template.subject;
    for (const [key, value] of Object.entries(data)) {
      html = html.replace(new RegExp(`{{${key}}}`, "g"), String(value));
      subject = subject.replace(new RegExp(`{{${key}}}`, "g"), String(value));
    }

    return this.send({ to, subject, html });
  }

  async sendBulk(messages: EmailMessage[]): Promise<{ sent: number; failed: number; results: EmailResult[] }> {
    const results: EmailResult[] = [];
    let sent = 0, failed = 0;
    for (const msg of messages) {
      const result = await this.send(msg);
      results.push(result);
      result.success ? sent++ : failed++;
    }
    return { sent, failed, results };
  }

  queueEmail(message: EmailMessage): void {
    this.queue.push({ message, attempts: 0 });
  }

  async processQueue(): Promise<{ processed: number; failed: number }> {
    let processed = 0, failed = 0;
    while (this.queue.length > 0) {
      const item = this.queue.shift()!;
      const result = await this.send(item.message);
      if (result.success) {
        processed++;
      } else if (item.attempts < 3) {
        item.attempts++;
        this.queue.push(item);
      } else {
        failed++;
      }
    }
    return { processed, failed };
  }

  getTemplates(): EmailTemplate[] {
    return Object.values(templates);
  }

  getTemplate(id: string): EmailTemplate | null {
    return templates[id] || null;
  }

  async sendWelcome(to: string, nome: string, empresa: string): Promise<EmailResult> {
    return this.sendTemplate("welcome", to, { nome, empresa });
  }

  async sendFeriasAprovadas(to: string, nome: string, inicio: string, fim: string): Promise<EmailResult> {
    return this.sendTemplate("ferias_aprovadas", to, { nome, inicio, fim });
  }

  async sendHolerite(to: string, nome: string, competencia: string): Promise<EmailResult> {
    return this.sendTemplate("holerite", to, { nome, competencia });
  }

  async sendAniversario(to: string, nome: string): Promise<EmailResult> {
    return this.sendTemplate("aniversario", to, { nome });
  }
}

export const emailService = new EmailService();
export default emailService;
