export const tiposContrato = { ITEM_1: "item_1", ITEM_2: "item_2", ITEM_3: "item_3", ITEM_4: "item_4", ITEM_5: "item_5" } as const;
export type tiposContratoType = typeof tiposContrato[keyof typeof tiposContrato];
export const tiposContratoLabels: Record<tiposContratoType, string> = { item_1: "Item 1", item_2: "Item 2", item_3: "Item 3", item_4: "Item 4", item_5: "Item 5" };
export const tiposContratoOptions = Object.entries(tiposContratoLabels).map(([value, label]) => ({ value, label }));
export function gettiposContratoLabel(value: tiposContratoType): string { return tiposContratoLabels[value] || value; }
export default { values: tiposContrato, labels: tiposContratoLabels, options: tiposContratoOptions, getLabel: gettiposContratoLabel };
