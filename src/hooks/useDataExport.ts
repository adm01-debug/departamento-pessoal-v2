import { useState, useCallback } from 'react';

type ExportFormat = 'csv' | 'excel' | 'pdf' | 'json';

export function useDataExport<T>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportData = useCallback(async (data: T[], format: ExportFormat, filename: string) => {
    setLoading(true);
    setError(null);
    try {
      let content: string;
      let mimeType: string;
      switch (format) {
        case 'csv': content = convertToCSV(data); mimeType = 'text/csv'; break;
        case 'json': content = JSON.stringify(data, null, 2); mimeType = 'application/json'; break;
        default: throw new Error(`Format ${format} not supported`);
      }
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `${filename}.${format}`; a.click();
      URL.revokeObjectURL(url);
    } catch (e) { setError(e instanceof Error ? e.message : 'Export failed'); }
    finally { setLoading(false); }
  }, []);

  return { exportData, loading, error };
}

function convertToCSV<T>(data: T[]): string {
  if (!data.length) return '';
  const headers = Object.keys(data[0] as object);
  const rows = data.map(row => headers.map(h => JSON.stringify((row as any)[h] ?? '')).join(','));
  return [headers.join(','), ...rows].join('\n');
}
export default useDataExport;
