export const routes = {
  DEFAULT: "default",
  ITEMS: [] as string[],
  MAP: {} as Record<string, any>,
  get(key: string): any { return this.MAP[key] || this.DEFAULT; },
  has(key: string): boolean { return key in this.MAP; },
  all(): string[] { return Object.keys(this.MAP); },
} as const;
export type routesType = keyof typeof routes;
export default routes;
