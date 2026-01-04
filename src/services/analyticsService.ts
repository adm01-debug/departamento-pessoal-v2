import { supabase } from "@/integrations/supabase/client";

export interface AnalyticsEvent {
  id?: string;
  eventName: string;
  eventCategory: string;
  eventAction: string;
  eventLabel?: string;
  eventValue?: number;
  userId?: string;
  sessionId?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface AnalyticsMetrics {
  totalEvents: number;
  uniqueUsers: number;
  eventsByCategory: Record<string, number>;
  eventsByAction: Record<string, number>;
  topEvents: { name: string; count: number }[];
  periodStart: string;
  periodEnd: string;
}

export interface PageView {
  path: string;
  title: string;
  referrer?: string;
  duration?: number;
  userId?: string;
  timestamp: string;
}

class AnalyticsService {
  private sessionId: string;
  private queue: AnalyticsEvent[] = [];
  private flushInterval: number = 5000;
  private maxQueueSize: number = 50;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.startAutoFlush();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private startAutoFlush(): void {
    if (typeof window !== "undefined") {
      setInterval(() => this.flush(), this.flushInterval);
      window.addEventListener("beforeunload", () => this.flush());
    }
  }

  async trackEvent(event: Omit<AnalyticsEvent, "id" | "timestamp" | "sessionId">): Promise<void> {
    const fullEvent: AnalyticsEvent = {
      ...event,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
    };
    this.queue.push(fullEvent);
    if (this.queue.length >= this.maxQueueSize) {
      await this.flush();
    }
  }

  async trackPageView(pageView: Omit<PageView, "timestamp">): Promise<void> {
    await this.trackEvent({
      eventName: "page_view",
      eventCategory: "navigation",
      eventAction: "view",
      eventLabel: pageView.path,
      metadata: { title: pageView.title, referrer: pageView.referrer, duration: pageView.duration },
    });
  }

  async trackClick(element: string, context?: string): Promise<void> {
    await this.trackEvent({
      eventName: "click",
      eventCategory: "interaction",
      eventAction: "click",
      eventLabel: element,
      metadata: { context },
    });
  }

  async trackError(error: Error, context?: string): Promise<void> {
    await this.trackEvent({
      eventName: "error",
      eventCategory: "error",
      eventAction: error.name,
      eventLabel: error.message,
      metadata: { stack: error.stack, context },
    });
  }

  async trackTiming(category: string, variable: string, duration: number): Promise<void> {
    await this.trackEvent({
      eventName: "timing",
      eventCategory: category,
      eventAction: variable,
      eventValue: duration,
    });
  }

  async flush(): Promise<void> {
    if (this.queue.length === 0) return;
    const events = [...this.queue];
    this.queue = [];
    try {
      console.log(`[Analytics] Flushing ${events.length} events`);
      // In production, send to analytics backend
    } catch (error) {
      console.error("[Analytics] Flush failed:", error);
      this.queue = [...events, ...this.queue];
    }
  }

  async getMetrics(startDate: string, endDate: string): Promise<AnalyticsMetrics> {
    return {
      totalEvents: 0,
      uniqueUsers: 0,
      eventsByCategory: {},
      eventsByAction: {},
      topEvents: [],
      periodStart: startDate,
      periodEnd: endDate,
    };
  }

  async getDashboardData(): Promise<{
    todayEvents: number;
    weekEvents: number;
    monthEvents: number;
    activeUsers: number;
    topPages: { path: string; views: number }[];
  }> {
    return {
      todayEvents: 0,
      weekEvents: 0,
      monthEvents: 0,
      activeUsers: 0,
      topPages: [],
    };
  }

  getSessionId(): string {
    return this.sessionId;
  }

  resetSession(): void {
    this.sessionId = this.generateSessionId();
  }
}

export const analyticsService = new AnalyticsService();
export default analyticsService;
