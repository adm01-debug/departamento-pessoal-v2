export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> { return keys.reduce((acc, key) => { if (key in obj) acc[key] = obj[key]; return acc; }, {} as Pick<T, K>); }
export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> { const result = { ...obj }; keys.forEach(key => delete result[key]); return result; }
export function deepClone<T>(obj: T): T { return JSON.parse(JSON.stringify(obj)); }
export function isEmpty(obj: any): boolean { if (obj == null) return true; if (Array.isArray(obj) || typeof obj === "string") return obj.length === 0; if (typeof obj === "object") return Object.keys(obj).length === 0; return false; }
export function deepMerge<T extends object>(target: T, source: Partial<T>): T { const result = { ...target }; for (const key in source) { if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) { result[key] = deepMerge(result[key] as any, source[key] as any); } else { result[key] = source[key] as any; } } return result; }
export default { pick, omit, deepClone, isEmpty, deepMerge };
