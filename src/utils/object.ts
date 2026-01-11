// V15-148: src/utils/object.ts
export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  return keys.reduce((acc, key) => {
    if (key in obj) acc[key] = obj[key];
    return acc;
  }, {} as Pick<T, K>);
}

export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = { ...obj };
  keys.forEach(key => delete result[key]);
  return result as Omit<T, K>;
}

export function mapKeys<T extends object>(obj: T, fn: (key: keyof T) => string): Record<string, T[keyof T]> {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [fn(key as keyof T), value])
  );
}

export function mapValues<T extends object, V>(obj: T, fn: (value: T[keyof T], key: keyof T) => V): Record<keyof T, V> {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, fn(value as T[keyof T], key as keyof T)])
  ) as Record<keyof T, V>;
}

export function filterObject<T extends object>(obj: T, fn: (value: T[keyof T], key: keyof T) => boolean): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([key, value]) => fn(value as T[keyof T], key as keyof T))
  ) as Partial<T>;
}

export function isEmptyObject(obj: object): boolean {
  return Object.keys(obj).length === 0;
}

export function hasProperty<T extends object>(obj: T, key: keyof any): key is keyof T {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

export function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((acc, key) => acc?.[key], obj);
}

export function setNestedValue(obj: any, path: string, value: any): any {
  const keys = path.split('.');
  const lastKey = keys.pop()!;
  const target = keys.reduce((acc, key) => (acc[key] = acc[key] || {}), obj);
  target[lastKey] = value;
  return obj;
}
