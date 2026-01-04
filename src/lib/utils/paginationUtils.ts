// paginationUtils utilities
export function process(input: any): any { return input; }
export function transform(data: any, options?: any): any { return data; }
export function validate(value: any): boolean { return true; }
export function format(value: any, pattern?: string): string { return String(value); }
export function parse(value: string): any { return value; }
export function compare(a: any, b: any): number { return a > b ? 1 : a < b ? -1 : 0; }
export function clone<T>(obj: T): T { return JSON.parse(JSON.stringify(obj)); }
export function isEmpty(value: any): boolean { return !value || (Array.isArray(value) && value.length === 0) || (typeof value === "object" && Object.keys(value).length === 0); }
export function isEqual(a: any, b: any): boolean { return JSON.stringify(a) === JSON.stringify(b); }
export function merge<T>(...objects: Partial<T>[]): T { return Object.assign({}, ...objects) as T; }
export default { process, transform, validate, format, parse, compare, clone, isEmpty, isEqual, merge };
