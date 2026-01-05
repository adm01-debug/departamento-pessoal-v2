type EventHandler = (...args: any[]) => void;
class EventBus {
  private events: Map<string, EventHandler[]> = new Map();
  on(event: string, handler: EventHandler): void { if (!this.events.has(event)) this.events.set(event, []); this.events.get(event)!.push(handler); }
  off(event: string, handler: EventHandler): void { const handlers = this.events.get(event); if (handlers) this.events.set(event, handlers.filter(h => h !== handler)); }
  emit(event: string, ...args: any[]): void { const handlers = this.events.get(event); if (handlers) handlers.forEach(h => h(...args)); }
  once(event: string, handler: EventHandler): void { const wrapper = (...args: any[]) => { handler(...args); this.off(event, wrapper); }; this.on(event, wrapper); }
  clear(): void { this.events.clear(); }
}
export const eventBus = new EventBus();
export const EVENTS = { COLABORADOR_CREATED: "colaborador:created", COLABORADOR_UPDATED: "colaborador:updated", COLABORADOR_DELETED: "colaborador:deleted", FOLHA_CALCULATED: "folha:calculated", FOLHA_CLOSED: "folha:closed", FERIAS_APPROVED: "ferias:approved", DEMISSAO_PROCESSED: "demissao:processed", ESOCIAL_SENT: "esocial:sent", NOTIFICATION_NEW: "notification:new" };
export default eventBus;
