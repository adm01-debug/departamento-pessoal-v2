import { useCallback, useState } from "react";
export function useExport<T extends Record<string, any>>() {
  const [isExporting, setIsExporting] = useState(false);
  const exportToCSV = useCallback((data: T[], filename: string, columns?: { key: keyof T; label: string }[]) => {
    setIsExporting(true);
    try {
      const cols = columns || Object.keys(data[0] || {}).map(k => ({ key: k as keyof T, label: k }));
      const header = cols.map(c => c.label).join(";");
      const rows = data.map(item => cols.map(c => String(item[c.key] ?? "").replace(/;/g, ",")).join(";")).join("\n");
      const csv = "\uFEFF" + header + "\n" + rows;
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = `${filename}.csv`; link.click();
    } finally { setIsExporting(false); }
  }, []);
  const exportToJSON = useCallback((data: T[], filename: string) => {
    setIsExporting(true);
    try { const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }); const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = `${filename}.json`; link.click(); }
    finally { setIsExporting(false); }
  }, []);
  return { exportToCSV, exportToJSON, isExporting };
}
export default useExport;
