// V15-153: src/utils/url.ts
export function getQueryParams(url?: string): Record<string, string> {
  const search = url ? new URL(url).search : window.location.search;
  const params = new URLSearchParams(search);
  const result: Record<string, string> = {};
  params.forEach((value, key) => { result[key] = value; });
  return result;
}

export function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  return searchParams.toString();
}

export function updateQueryParam(key: string, value: string): void {
  const url = new URL(window.location.href);
  url.searchParams.set(key, value);
  window.history.pushState({}, '', url.toString());
}

export function removeQueryParam(key: string): void {
  const url = new URL(window.location.href);
  url.searchParams.delete(key);
  window.history.pushState({}, '', url.toString());
}

export function isValidUrl(str: string): boolean {
  try { new URL(str); return true; } catch { return false; }
}

export function getBaseUrl(): string {
  return `${window.location.protocol}//${window.location.host}`;
}

export function joinPaths(...paths: string[]): string {
  return paths.map(p => p.replace(/^\/|\/$/g, '')).filter(Boolean).join('/');
}

export function getDomain(url: string): string {
  try { return new URL(url).hostname; } catch { return ''; }
}
