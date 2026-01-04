export const statusFolha = { ITEM_1: "item_1", ITEM_2: "item_2", ITEM_3: "item_3", ITEM_4: "item_4", ITEM_5: "item_5" } as const;
export type statusFolhaType = typeof statusFolha[keyof typeof statusFolha];
export const statusFolhaLabels: Record<statusFolhaType, string> = { item_1: "Item 1", item_2: "Item 2", item_3: "Item 3", item_4: "Item 4", item_5: "Item 5" };
export const statusFolhaOptions = Object.entries(statusFolhaLabels).map(([value, label]) => ({ value, label }));
export function getstatusFolhaLabel(value: statusFolhaType): string { return statusFolhaLabels[value] || value; }
export default { values: statusFolha, labels: statusFolhaLabels, options: statusFolhaOptions, getLabel: getstatusFolhaLabel };
