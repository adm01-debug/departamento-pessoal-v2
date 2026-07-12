// Helper compartilhado para geração de hash de integridade não-repudiável.
// Uso em calcular-folha, fechar-folha, reabrir-folha para garantir que o
// mesmo snapshot produza SEMPRE o mesmo hash, independente da ordem das
// chaves ou do formato do JSON.
//
// Canonicalização: JSON com chaves ordenadas alfabeticamente (RFC 8785 subset).
// Hash: SHA-256 hexadecimal lowercase.

/** Serializa `value` em JSON canônico: chaves de objeto ordenadas alfabeticamente. */
export function canonicalize(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value ?? null);
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`;
  const keys = Object.keys(value as Record<string, unknown>).sort();
  return `{${keys
    .map((k) => `${JSON.stringify(k)}:${canonicalize((value as Record<string, unknown>)[k])}`)
    .join(",")}}`;
}

/** SHA-256(input) → string hex lowercase. */
export async function sha256Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Atalho: hash SHA-256 do snapshot canônico. */
export async function integrityHash(snapshot: unknown): Promise<string> {
  return sha256Hex(canonicalize(snapshot));
}
