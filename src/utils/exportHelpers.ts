// V20-UTIL001: Export Helpers
export const exportToCSV = (data: any[], filename: string) => {
  const headers = Object.keys(data[0] || {}).join(",");
  const rows = data.map(row => Object.values(row).join(",")).join("
");
  const csv = headers + "
" + rows;
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
};

export const exportToJSON = (data: any[], filename: string) => {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
};
