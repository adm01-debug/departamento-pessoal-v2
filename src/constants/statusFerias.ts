export const statusFerias = { ITEM_1: "item_1", ITEM_2: "item_2", ITEM_3: "item_3", ITEM_4: "item_4", ITEM_5: "item_5" } as const;
export type statusFeriasType = typeof statusFerias[keyof typeof statusFerias];
export const statusFeriasLabels: Record<statusFeriasType, string> = { item_1: "Item 1", item_2: "Item 2", item_3: "Item 3", item_4: "Item 4", item_5: "Item 5" };
export const statusFeriasOptions = Object.entries(statusFeriasLabels).map(([value, label]) => ({ value, label }));
export function getstatusFeriasLabel(value: statusFeriasType): string { return statusFeriasLabels[value] || value; }
export default { values: statusFerias, labels: statusFeriasLabels, options: statusFeriasOptions, getLabel: getstatusFeriasLabel };
