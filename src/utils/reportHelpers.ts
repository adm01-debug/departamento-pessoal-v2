// V20-UTIL004: Report Helpers
export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
};

export const formatPercentage = (value: number) => {
  return new Intl.NumberFormat("pt-BR", { style: "percent", minimumFractionDigits: 2 }).format(value / 100);
};

export const formatDate = (date: Date | string) => {
  return new Intl.DateTimeFormat("pt-BR").format(new Date(date));
};

export const generateReportHeader = (titulo: string, periodo: string) => {
  return { titulo, periodo, geradoEm: new Date().toISOString(), empresa: "Empresa" };
};
