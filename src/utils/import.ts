// @ts-nocheck
export async function parseCSV<T>(file: File): Promise<T[]> {
  const text = await file.text();
  const lines = text.split('\n').filter(l => l.trim());
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
    const obj: any = {};
    headers.forEach((h, i) => { obj[h] = values[i] || ''; });
    return obj as T;
  });
}
export function validateImportData<T>(data: T[], requiredFields: string[]): string[] {
  const errors: string[] = [];
  data.forEach((row, index) => { requiredFields.forEach(field => { if (!(row as any)[field]) { errors.push(`Linha ${index + 2}: Campo '${field}' obrigatório`); } }); });
  return errors;
}
