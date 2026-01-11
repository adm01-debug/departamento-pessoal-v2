// V15-095: src/lib/abbreviate.ts

export function abbreviate(text: string, maxLength: number = 20): string {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

export function abbreviateName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length <= 2) return fullName;
  const first = parts[0];
  const last = parts[parts.length - 1];
  const middle = parts.slice(1, -1).map(p => p[0] + '.').join(' ');
  return `${first} ${middle} ${last}`;
}

export function abbreviateNumber(num: number): string {
  if (num < 1000) return num.toString();
  if (num < 1000000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  if (num < 1000000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
}

export function abbreviateCurrency(value: number, locale = 'pt-BR'): string {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'BRL',
    notation: 'compact',
    maximumFractionDigits: 1,
  });
  return formatter.format(value);
}
