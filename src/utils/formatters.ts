export const formatters = {
  cpf: (value: string): string => value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4"),
  cnpj: (value: string): string => value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5"),
  telefone: (value: string): string => value.length === 11 ? value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3") : value.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3"),
  cep: (value: string): string => value.replace(/(\d{5})(\d{3})/, "$1-$2"),
  moeda: (value: number, currency: string = "BRL"): string => new Intl.NumberFormat("pt-BR", { style: "currency", currency }).format(value),
  percentual: (value: number, decimals: number = 2): string => `${value.toFixed(decimals)}%`,
  data: (date: Date | string, format: string = "DD/MM/YYYY"): string => { const d = typeof date === "string" ? new Date(date) : date; const dd = String(d.getDate()).padStart(2, "0"); const mm = String(d.getMonth() + 1).padStart(2, "0"); const yyyy = d.getFullYear(); return format.replace("DD", dd).replace("MM", mm).replace("YYYY", String(yyyy)); },
  hora: (date: Date | string): string => { const d = typeof date === "string" ? new Date(date) : date; return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }); },
  pis: (value: string): string => value.replace(/(\d{3})(\d{5})(\d{2})(\d{1})/, "$1.$2.$3-$4"),
  ctps: (value: string): string => value.replace(/(\d+)(\d{4})/, "$1/$2"),
};
export default formatters;
