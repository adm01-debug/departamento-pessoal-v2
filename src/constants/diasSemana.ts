export const diasSemana = { ITEM_1: "item_1", ITEM_2: "item_2", ITEM_3: "item_3", ITEM_4: "item_4", ITEM_5: "item_5" } as const;
export type diasSemanaType = typeof diasSemana[keyof typeof diasSemana];
export const diasSemanaLabels: Record<diasSemanaType, string> = { item_1: "Item 1", item_2: "Item 2", item_3: "Item 3", item_4: "Item 4", item_5: "Item 5" };
export const diasSemanaOptions = Object.entries(diasSemanaLabels).map(([value, label]) => ({ value, label }));
export function getdiasSemanaLabel(value: diasSemanaType): string { return diasSemanaLabels[value] || value; }
export default { values: diasSemana, labels: diasSemanaLabels, options: diasSemanaOptions, getLabel: getdiasSemanaLabel };
