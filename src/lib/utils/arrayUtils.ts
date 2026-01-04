// arrayUtils - Utility functions for array operations

export function isEmpty(value: any): boolean { return value === null || value === undefined || value === "" || (Array.isArray(value) && value.length === 0) || (typeof value === "object" && Object.keys(value).length === 0); }

export function isValid(value: any): boolean { return !isEmpty(value); }

export function clone<T>(value: T): T { return JSON.parse(JSON.stringify(value)); }

export function merge<T extends object>(...objects: Partial<T>[]): T { return objects.reduce((acc, obj) => ({ ...acc, ...obj }), {} as T); }

export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> { return keys.reduce((acc, key) => { if (key in obj) acc[key] = obj[key]; return acc; }, {} as Pick<T, K>); }

export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> { const result = { ...obj }; keys.forEach(key => delete result[key]); return result; }

export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> { return array.reduce((acc, item) => { const k = String(item[key]); (acc[k] = acc[k] || []).push(item); return acc; }, {} as Record<string, T[]>); }

export function unique<T>(array: T[]): T[] { return [...new Set(array)]; }

export function chunk<T>(array: T[], size: number): T[][] { const chunks: T[][] = []; for (let i = 0; i < array.length; i += size) chunks.push(array.slice(i, i + size)); return chunks; }

export function debounce<T extends (...args: any[]) => any>(fn: T, delay: number): (...args: Parameters<T>) => void { let timeoutId: ReturnType<typeof setTimeout>; return (...args: Parameters<T>) => { clearTimeout(timeoutId); timeoutId = setTimeout(() => fn(...args), delay); }; }

export function throttle<T extends (...args: any[]) => any>(fn: T, limit: number): (...args: Parameters<T>) => void { let inThrottle = false; return (...args: Parameters<T>) => { if (!inThrottle) { fn(...args); inThrottle = true; setTimeout(() => inThrottle = false, limit); } }; }

export default { isEmpty, isValid, clone, merge, pick, omit, groupBy, unique, chunk, debounce, throttle };
