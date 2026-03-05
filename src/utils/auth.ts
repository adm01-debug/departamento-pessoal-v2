// @ts-nocheck
interface TokenPayload { sub: string; exp: number; iat: number; email: string; perfil: string; }
export function decodeToken(token: string): TokenPayload | null { try { const parts = token.split('.'); if (parts.length !== 3) return null; return JSON.parse(atob(parts[1])); } catch { return null; } }
export function isTokenExpired(token: string): boolean { const payload = decodeToken(token); if (!payload) return true; return payload.exp < Date.now() / 1000; }
export function getTokenExpirationDate(token: string): Date | null { const payload = decodeToken(token); if (!payload) return null; return new Date(payload.exp * 1000); }
export function getTimeUntilExpiration(token: string): number { const payload = decodeToken(token); if (!payload) return 0; return Math.max(0, (payload.exp - Date.now() / 1000) * 1000); }
export function shouldRefreshToken(token: string, thresholdMinutes = 5): boolean { return getTimeUntilExpiration(token) < thresholdMinutes * 60 * 1000; }
