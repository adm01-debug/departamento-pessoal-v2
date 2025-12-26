export const formatCurrency = (value: number, currency = 'BRL') => new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(value);
export const parseCurrency = (value: string) => parseFloat(value.replace(/[^\d,-]/g, '').replace(',', '.'));
export const centsToCurrency = (cents: number) => cents / 100;
export const currencyToCents = (value: number) => Math.round(value * 100);
