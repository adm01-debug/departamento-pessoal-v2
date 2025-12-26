export const filterByField = <T>(arr: T[], field: keyof T, value: any) => arr.filter(item => item[field] === value);
export const filterBySearch = <T>(arr: T[], fields: (keyof T)[], query: string) => arr.filter(item => fields.some(field => String(item[field]).toLowerCase().includes(query.toLowerCase())));
export const filterByDateRange = <T>(arr: T[], field: keyof T, start: Date, end: Date) => arr.filter(item => { const date = new Date(item[field] as any); return date >= start && date <= end; });
