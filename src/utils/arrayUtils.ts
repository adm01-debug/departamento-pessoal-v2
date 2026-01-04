export function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> { return arr.reduce((acc, item) => { const k = String(item[key]); (acc[k] = acc[k] || []).push(item); return acc; }, {} as Record<string, T[]>); }
export function sortBy<T>(arr: T[], key: keyof T, order: "asc" | "desc" = "asc"): T[] { return [...arr].sort((a, b) => { const va = a[key], vb = b[key]; const cmp = va > vb ? 1 : va < vb ? -1 : 0; return order === "asc" ? cmp : -cmp; }); }
export function unique<T>(arr: T[], key?: keyof T): T[] { if (!key) return [...new Set(arr)]; const seen = new Set(); return arr.filter(item => { const k = item[key]; if (seen.has(k)) return false; seen.add(k); return true; }); }
export function chunk<T>(arr: T[], size: number): T[][] { const chunks: T[][] = []; for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size)); return chunks; }
export function sum(arr: number[]): number { return arr.reduce((a, b) => a + b, 0); }
export function average(arr: number[]): number { return arr.length ? sum(arr) / arr.length : 0; }
export default { groupBy, sortBy, unique, chunk, sum, average };
