export const statusPonto = { ITEM_1: "item_1", ITEM_2: "item_2", ITEM_3: "item_3", ITEM_4: "item_4", ITEM_5: "item_5" } as const;
export type statusPontoType = typeof statusPonto[keyof typeof statusPonto];
export const statusPontoLabels: Record<statusPontoType, string> = { item_1: "Item 1", item_2: "Item 2", item_3: "Item 3", item_4: "Item 4", item_5: "Item 5" };
export const statusPontoOptions = Object.entries(statusPontoLabels).map(([value, label]) => ({ value, label }));
export function getstatusPontoLabel(value: statusPontoType): string { return statusPontoLabels[value] || value; }
export default { values: statusPonto, labels: statusPontoLabels, options: statusPontoOptions, getLabel: getstatusPontoLabel };
