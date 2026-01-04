export function toAPI(data: any): any { return { ...data, updatedAt: new Date().toISOString() }; }
export function fromAPI(data: any): any { return { ...data, updatedAt: data.updatedAt ? new Date(data.updatedAt) : undefined }; }
export function toForm(data: any): any { return Object.fromEntries(Object.entries(data).map(([k, v]) => [k, v ?? ""])); }
export function fromForm(data: any): any { return Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== "")); }
export function toExport(data: any[]): any[] { return data.map(item => ({ ...item, _exported: true })); }
export function fromImport(data: any[]): any[] { return data.map(item => { const { _exported, ...rest } = item; return rest; }); }
export const dateTransformer = { toAPI, fromAPI, toForm, fromForm, toExport, fromImport };
export default dateTransformer;
