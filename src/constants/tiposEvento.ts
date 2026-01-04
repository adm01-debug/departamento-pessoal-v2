export const tiposEvento = { ITEM_1: "item_1", ITEM_2: "item_2", ITEM_3: "item_3", ITEM_4: "item_4", ITEM_5: "item_5" } as const;
export type tiposEventoType = typeof tiposEvento[keyof typeof tiposEvento];
export const tiposEventoLabels: Record<tiposEventoType, string> = { item_1: "Item 1", item_2: "Item 2", item_3: "Item 3", item_4: "Item 4", item_5: "Item 5" };
export const tiposEventoOptions = Object.entries(tiposEventoLabels).map(([value, label]) => ({ value, label }));
export function gettiposEventoLabel(value: tiposEventoType): string { return tiposEventoLabels[value] || value; }
export default { values: tiposEvento, labels: tiposEventoLabels, options: tiposEventoOptions, getLabel: gettiposEventoLabel };
