// V15-102: src/lib/random.ts

export function random(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomFloat(min: number, max: number, decimals = 2): number {
  const value = Math.random() * (max - min) + min;
  return Number(value.toFixed(decimals));
}

export function randomString(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => chars[random(0, chars.length - 1)]).join('');
}

export function randomHex(length: number = 6): string {
  return Array.from({ length }, () => random(0, 15).toString(16)).join('');
}

export function randomColor(): string {
  return '#' + randomHex(6);
}

export function randomElement<T>(array: T[]): T {
  return array[random(0, array.length - 1)];
}

export function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = random(0, i);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
