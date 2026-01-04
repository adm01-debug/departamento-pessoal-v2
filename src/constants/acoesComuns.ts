export const acoesComuns = { ITEM_1: "item_1", ITEM_2: "item_2", ITEM_3: "item_3", ITEM_4: "item_4", ITEM_5: "item_5" } as const;
export type acoesComunsType = typeof acoesComuns[keyof typeof acoesComuns];
export const acoesComunsLabels: Record<acoesComunsType, string> = { item_1: "Item 1", item_2: "Item 2", item_3: "Item 3", item_4: "Item 4", item_5: "Item 5" };
export const acoesComunsOptions = Object.entries(acoesComunsLabels).map(([value, label]) => ({ value, label }));
export function getacoesComunsLabel(value: acoesComunsType): string { return acoesComunsLabels[value] || value; }
export default { values: acoesComuns, labels: acoesComunsLabels, options: acoesComunsOptions, getLabel: getacoesComunsLabel };
