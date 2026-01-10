// V14-071: googleCalendar/index.ts
export interface GoogleCalendarConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
}

export interface CalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  start: { dateTime: string; timeZone?: string };
  end: { dateTime: string; timeZone?: string };
  attendees?: Array<{ email: string }>;
  reminders?: { useDefault: boolean; overrides?: Array<{ method: string; minutes: number }> };
}

export class GoogleCalendarIntegration {
  private config: GoogleCalendarConfig;
  private accessToken: string | null = null;

  constructor(config: GoogleCalendarConfig) {
    this.config = config;
  }

  getAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: "code",
      scope: this.config.scopes.join(" "),
      access_type: "offline",
      prompt: "consent",
    });
    return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  }

  async exchangeCode(code: string): Promise<{ accessToken: string; refreshToken: string }> {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        redirect_uri: this.config.redirectUri,
        grant_type: "authorization_code",
      }),
    });
    const data = await response.json();
    this.accessToken = data.access_token;
    return { accessToken: data.access_token, refreshToken: data.refresh_token };
  }

  setAccessToken(token: string): void {
    this.accessToken = token;
  }

  async createEvent(calendarId: string, event: CalendarEvent): Promise<CalendarEvent> {
    if (!this.accessToken) throw new Error("Not authenticated");
    const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`, {
      method: "POST",
      headers: { Authorization: `Bearer ${this.accessToken}`, "Content-Type": "application/json" },
      body: JSON.stringify(event),
    });
    return response.json();
  }

  async listEvents(calendarId: string, timeMin?: string, timeMax?: string): Promise<CalendarEvent[]> {
    if (!this.accessToken) throw new Error("Not authenticated");
    const params = new URLSearchParams({ singleEvents: "true", orderBy: "startTime" });
    if (timeMin) params.set("timeMin", timeMin);
    if (timeMax) params.set("timeMax", timeMax);
    const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?${params}`, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
    });
    const data = await response.json();
    return data.items || [];
  }
}

export const createGoogleCalendarIntegration = (config: GoogleCalendarConfig) => new GoogleCalendarIntegration(config);

