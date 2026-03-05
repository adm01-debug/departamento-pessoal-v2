// @ts-nocheck
export function sortByDate(a: string, b: string): number { return new Date(a).getTime() - new Date(b).getTime(); }
export function sortByNumber(a: number, b: number): number { return a - b; }
export function sortByString(a: string, b: string): number { return a.localeCompare(b, 'pt-BR'); }
export function filterBySearch<T>(data: T[], search: string, keys: string[]): T[] {
  if (!search.trim()) return data;
  const s = search.toLowerCase();
  return data.filter(item => keys.some(key => String((item as any)[key]).toLowerCase().includes(s)));
}
export function paginate<T>(data: T[], page: number, pageSize: number): T[] { return data.slice((page - 1) * pageSize, page * pageSize); }
export function getTotalPages(total: number, pageSize: number): number { return Math.ceil(total / pageSize); }
