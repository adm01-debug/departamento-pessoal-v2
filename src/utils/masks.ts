export const masks = {
  cpf: (value: string): string => value.replace(/\D/g, "").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2").slice(0, 14),
  cnpj: (value: string): string => value.replace(/\D/g, "").replace(/^(\d{2})(\d)/, "$1.$2").replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3").replace(/\.(\d{3})(\d)/, ".$1/$2").replace(/(\d{4})(\d)/, "$1-$2").slice(0, 18),
  telefone: (value: string): string => { const digits = value.replace(/\D/g, ""); if (digits.length <= 10) return digits.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2"); return digits.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2").slice(0, 15); },
  cep: (value: string): string => value.replace(/\D/g, "").replace(/(\d{5})(\d)/, "$1-$2").slice(0, 9),
  moeda: (value: string): string => { const digits = value.replace(/\D/g, ""); const number = parseInt(digits || "0") / 100; return number.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); },
  data: (value: string): string => value.replace(/\D/g, "").replace(/(\d{2})(\d)/, "$1/$2").replace(/(\d{2})(\d)/, "$1/$2").slice(0, 10),
  hora: (value: string): string => value.replace(/\D/g, "").replace(/(\d{2})(\d)/, "$1:$2").slice(0, 5),
  pis: (value: string): string => value.replace(/\D/g, "").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{5})(\d)/, "$1.$2").replace(/(\d{2})(\d)/, "$1-$2").slice(0, 14),
  apenasNumeros: (value: string): string => value.replace(/\D/g, ""),
  apenasLetras: (value: string): string => value.replace(/[^a-zA-ZÀ-ÿ\s]/g, ""),
};
export default masks;
