export const statusContrato = { ITEM_1: "item_1", ITEM_2: "item_2", ITEM_3: "item_3", ITEM_4: "item_4", ITEM_5: "item_5" } as const;
export type statusContratoType = typeof statusContrato[keyof typeof statusContrato];
export const statusContratoLabels: Record<statusContratoType, string> = { item_1: "Item 1", item_2: "Item 2", item_3: "Item 3", item_4: "Item 4", item_5: "Item 5" };
export const statusContratoOptions = Object.entries(statusContratoLabels).map(([value, label]) => ({ value, label }));
export function getstatusContratoLabel(value: statusContratoType): string { return statusContratoLabels[value] || value; }
export default { values: statusContrato, labels: statusContratoLabels, options: statusContratoOptions, getLabel: getstatusContratoLabel };
