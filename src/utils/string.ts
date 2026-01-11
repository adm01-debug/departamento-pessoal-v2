// V15-149: src/utils/string.ts
export function truncate(str: string, length: number, suffix = '...'): string {
  if (str.length <= length) return str;
  return str.slice(0, length - suffix.length) + suffix;
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function camelCase(str: string): string {
  return str.replace(/[-_\s]+(.)?/g, (_, c) => c?.toUpperCase() ?? '').replace(/^./, c => c.toLowerCase());
}

export function snakeCase(str: string): string {
  return str.replace(/([A-Z])/g, '_$1').replace(/^_/, '').toLowerCase();
}

export function kebabCase(str: string): string {
  return str.replace(/([A-Z])/g, '-$1').replace(/^-/, '').toLowerCase();
}

export function pascalCase(str: string): string {
  return str.replace(/[-_\s]+(.)?/g, (_, c) => c?.toUpperCase() ?? '').replace(/^./, c => c.toUpperCase());
}

export function removeAccents(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function slugify(str: string): string {
  return removeAccents(str).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? singular : (plural ?? singular + 's');
}

export function padStart(str: string, length: number, char = '0'): string {
  return str.padStart(length, char);
}

export function template(str: string, data: Record<string, any>): string {
  return str.replace(/\{\{(\w+)\}\}/g, (_, key) => String(data[key] ?? ''));
}
