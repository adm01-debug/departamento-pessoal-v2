// V15-106: src/services/queueService.ts

interface QueueItem<T> {
  id: string;
  data: T;
  priority: number;
  retries: number;
  createdAt: Date;
}

interface QueueOptions {
  maxRetries?: number;
  concurrency?: number;
  retryDelay?: number;
}

export class QueueService<T> {
  private queue: QueueItem<T>[] = [];
  private processing = false;
  private options: Required<QueueOptions>;

  constructor(options: QueueOptions = {}) {
    this.options = {
      maxRetries: options.maxRetries ?? 3,
      concurrency: options.concurrency ?? 1,
      retryDelay: options.retryDelay ?? 1000,
    };
  }

  add(data: T, priority = 0): string {
    const id = crypto.randomUUID();
    this.queue.push({ id, data, priority, retries: 0, createdAt: new Date() });
    this.queue.sort((a, b) => b.priority - a.priority);
    return id;
  }

  async process(handler: (data: T) => Promise<void>): Promise<void> {
    if (this.processing) return;
    this.processing = true;

    while (this.queue.length > 0) {
      const item = this.queue.shift()!;
      try {
        await handler(item.data);
      } catch (error) {
        if (item.retries < this.options.maxRetries) {
          item.retries++;
          await new Promise(r => setTimeout(r, this.options.retryDelay));
          this.queue.push(item);
        } else {
          console.error(`Queue item ${item.id} failed after ${item.retries} retries`);
        }
      }
    }
    this.processing = false;
  }

  get length(): number { return this.queue.length; }
  get isProcessing(): boolean { return this.processing; }
  clear(): void { this.queue = []; }
}

export const createQueue = <T>(options?: QueueOptions) => new QueueService<T>(options);
