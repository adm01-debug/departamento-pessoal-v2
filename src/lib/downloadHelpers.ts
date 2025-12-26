export const downloadFile = (url: string, filename?: string) => { const a = document.createElement('a'); a.href = url; a.download = filename || ''; a.click(); };
export const downloadBlob = (blob: Blob, filename: string) => { const url = URL.createObjectURL(blob); downloadFile(url, filename); URL.revokeObjectURL(url); };
export const downloadJson = (data: any, filename: string) => { const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }); downloadBlob(blob, filename); };
export const downloadCsv = (data: string, filename: string) => { const blob = new Blob([data], { type: 'text/csv' }); downloadBlob(blob, filename); };
