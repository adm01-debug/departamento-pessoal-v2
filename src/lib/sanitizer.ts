// V16-043: Input Sanitizer for XSS Prevention
const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '/': '&#x2F;',
};

export function escapeHtml(str: string): string {
  return str.replace(/[&<>"'\/]/g, (char) => HTML_ENTITIES[char] || char);
}

export function sanitizeInput(input: string): string {
  return escapeHtml(input.trim());
}

export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const sanitized = {} as T;
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      (sanitized as any)[key] = sanitizeInput(value);
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      (sanitized as any)[key] = sanitizeObject(value as Record<string, unknown>);
    } else {
      (sanitized as any)[key] = value;
    }
  }
  return sanitized;
}

export function stripHtmlTags(str: string): string {
  return str.replace(/<[^>]*>/g, '');
}

export function sanitizeSql(str: string): string {
  return str.replace(/['"\;]/g, '');
}

export function isValidUUID(str: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}
