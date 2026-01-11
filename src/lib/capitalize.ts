// V15-096: src/lib/capitalize.ts

export function capitalize(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export function capitalizeWords(text: string): string {
  if (!text) return '';
  return text.split(/\s+/).map(word => capitalize(word)).join(' ');
}

export function capitalizeFirst(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function capitalizeNome(nome: string): string {
  if (!nome) return '';
  const preposicoes = ['de', 'da', 'do', 'das', 'dos', 'e'];
  return nome
    .toLowerCase()
    .split(/\s+/)
    .map((word, index) => {
      if (index > 0 && preposicoes.includes(word)) return word;
      return capitalize(word);
    })
    .join(' ');
}

export function toUpperCase(text: string): string {
  return text?.toUpperCase() ?? '';
}

export function toLowerCase(text: string): string {
  return text?.toLowerCase() ?? '';
}
