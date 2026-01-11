// V15-101: src/lib/isEmpty.ts

export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (value instanceof Map || value instanceof Set) return value.size === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

export function isNotEmpty(value: unknown): boolean {
  return !isEmpty(value);
}

export function isBlank(value: string | null | undefined): boolean {
  return value === null || value === undefined || value.trim() === '';
}

export function isNotBlank(value: string | null | undefined): boolean {
  return !isBlank(value);
}

export function hasValue<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

export function defaultValue<T>(value: T | null | undefined, defaultVal: T): T {
  return hasValue(value) ? value : defaultVal;
}

export function coalesce<T>(...values: (T | null | undefined)[]): T | undefined {
  return values.find(hasValue);
}
