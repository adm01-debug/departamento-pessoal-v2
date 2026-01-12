// V17.2-LIB004: Currency Library
const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const numberFormatter = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const formatCurrency = (value: number): string => formatter.format(value);
export const formatNumber = (value: number): string => numberFormatter.format(value);
export const parseCurrency = (value: string): number => { const cleaned = value.replace(/[^\d,-]/g, '').replace('.', '').replace(',', '.'); return parseFloat(cleaned) || 0; };
export const round = (value: number, decimals: number = 2): number => { const factor = Math.pow(10, decimals); return Math.round(value * factor) / factor; };
