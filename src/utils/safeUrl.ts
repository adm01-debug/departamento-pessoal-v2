const ALLOWED_HOSTS = new Set([
  'ciziytrrjjotlsjzshnm.supabase.co',
  'viacep.com.br',
  'brasilapi.com.br',
  'api.hibp.com',
]);

const ALLOWED_HOST_SUFFIXES = [
  '.supabase.co',
  '.lovable.app',
  '.lovable.dev',
  '.sentry.io',
];

export function isAllowedUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') return false;
    const host = parsed.hostname;
    if (ALLOWED_HOSTS.has(host)) return true;
    return ALLOWED_HOST_SUFFIXES.some(suffix => host.endsWith(suffix));
  } catch {
    return false;
  }
}

export function assertAllowedUrl(url: string): void {
  if (!isAllowedUrl(url)) {
    throw new Error(`URL bloqueada por política de segurança: ${new URL(url).hostname}`);
  }
}
