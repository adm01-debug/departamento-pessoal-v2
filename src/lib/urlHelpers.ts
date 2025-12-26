export const buildUrl = (base: string, params: Record<string, any>) => { const url = new URL(base); Object.entries(params).forEach(([k, v]) => v !== undefined && url.searchParams.append(k, String(v))); return url.toString(); };
export const getQueryParams = () => Object.fromEntries(new URLSearchParams(window.location.search));
export const updateQueryParam = (key: string, value: string) => { const url = new URL(window.location.href); url.searchParams.set(key, value); window.history.pushState({}, '', url); };
export const removeQueryParam = (key: string) => { const url = new URL(window.location.href); url.searchParams.delete(key); window.history.pushState({}, '', url); };
