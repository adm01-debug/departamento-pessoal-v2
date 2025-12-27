import { useState, useCallback } from 'react';

export function useDataImport<T>() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<T[]>([]);
  const [error, setError] = useState<string | null>(null);

  const importFromFile = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const text = await file.text();
      const ext = file.name.split('.').pop()?.toLowerCase();
      let parsed: T[];
      if (ext === 'json') { parsed = JSON.parse(text); }
      else if (ext === 'csv') { parsed = parseCSV(text); }
      else throw new Error('Unsupported format');
      setData(parsed);
      return parsed;
    } catch (e) { setError(e instanceof Error ? e.message : 'Import failed'); return []; }
    finally { setLoading(false); }
  }, []);

  return { importFromFile, data, loading, error, reset: () => setData([]) };
}

function parseCSV<T>(csv: string): T[] {
  const lines = csv.trim().split('\n');
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim());
  return lines.slice(1).map(line => {
    const values = line.split(',');
    return headers.reduce((obj, h, i) => ({ ...obj, [h]: values[i]?.trim() }), {}) as T;
  });
}
export default useDataImport;
