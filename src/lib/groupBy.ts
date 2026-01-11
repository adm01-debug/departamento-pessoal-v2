// V15-100: src/lib/groupBy.ts

export function groupBy<T>(array: T[], key: keyof T | ((item: T) => string)): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = typeof key === 'function' ? key(item) : String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

export function groupByMultiple<T>(
  array: T[],
  keys: (keyof T)[]
): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = keys.map(k => String(item[k])).join('_');
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

export function countBy<T>(array: T[], key: keyof T | ((item: T) => string)): Record<string, number> {
  const grouped = groupBy(array, key);
  return Object.fromEntries(
    Object.entries(grouped).map(([k, v]) => [k, v.length])
  );
}

export function sumBy<T>(array: T[], key: keyof T): number {
  return array.reduce((sum, item) => sum + (Number(item[key]) || 0), 0);
}

export function maxBy<T>(array: T[], key: keyof T): T | undefined {
  return array.reduce((max, item) => 
    !max || item[key] > max[key] ? item : max
  , undefined as T | undefined);
}

export function minBy<T>(array: T[], key: keyof T): T | undefined {
  return array.reduce((min, item) => 
    !min || item[key] < min[key] ? item : min
  , undefined as T | undefined);
}
