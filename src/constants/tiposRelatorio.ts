export const tiposRelatorio = { ITEM_1: "item_1", ITEM_2: "item_2", ITEM_3: "item_3", ITEM_4: "item_4", ITEM_5: "item_5" } as const;
export type tiposRelatorioType = typeof tiposRelatorio[keyof typeof tiposRelatorio];
export const tiposRelatorioLabels: Record<tiposRelatorioType, string> = { item_1: "Item 1", item_2: "Item 2", item_3: "Item 3", item_4: "Item 4", item_5: "Item 5" };
export const tiposRelatorioOptions = Object.entries(tiposRelatorioLabels).map(([value, label]) => ({ value, label }));
export function gettiposRelatorioLabel(value: tiposRelatorioType): string { return tiposRelatorioLabels[value] || value; }
export default { values: tiposRelatorio, labels: tiposRelatorioLabels, options: tiposRelatorioOptions, getLabel: gettiposRelatorioLabel };
