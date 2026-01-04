export const ordenacoes = { ITEM_1: "item_1", ITEM_2: "item_2", ITEM_3: "item_3", ITEM_4: "item_4", ITEM_5: "item_5" } as const;
export type ordenacoesType = typeof ordenacoes[keyof typeof ordenacoes];
export const ordenacoesLabels: Record<ordenacoesType, string> = { item_1: "Item 1", item_2: "Item 2", item_3: "Item 3", item_4: "Item 4", item_5: "Item 5" };
export const ordenacoesOptions = Object.entries(ordenacoesLabels).map(([value, label]) => ({ value, label }));
export function getordenacoesLabel(value: ordenacoesType): string { return ordenacoesLabels[value] || value; }
export default { values: ordenacoes, labels: ordenacoesLabels, options: ordenacoesOptions, getLabel: getordenacoesLabel };
