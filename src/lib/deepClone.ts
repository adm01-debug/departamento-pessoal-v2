// V15-098: src/lib/deepClone.ts

export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  
  // Handle Date
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as any;
  }
  
  // Handle Array
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item)) as any;
  }
  
  // Handle Map
  if (obj instanceof Map) {
    const clone = new Map();
    obj.forEach((value, key) => clone.set(deepClone(key), deepClone(value)));
    return clone as any;
  }
  
  // Handle Set
  if (obj instanceof Set) {
    const clone = new Set();
    obj.forEach(value => clone.add(deepClone(value)));
    return clone as any;
  }
  
  // Handle Object
  const clone = {} as T;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      clone[key] = deepClone(obj[key]);
    }
  }
  return clone;
}

export function deepMerge<T extends object>(target: T, ...sources: Partial<T>[]): T {
  if (!sources.length) return target;
  const source = sources.shift();

  if (source && typeof source === 'object') {
    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
          if (!target[key]) Object.assign(target, { [key]: {} });
          deepMerge(target[key] as object, source[key] as object);
        } else {
          Object.assign(target, { [key]: source[key] });
        }
      }
    }
  }

  return deepMerge(target, ...sources);
}
