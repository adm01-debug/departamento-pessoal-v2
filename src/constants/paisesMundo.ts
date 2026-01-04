export const paisesMundo = { ITEM_1: "item_1", ITEM_2: "item_2", ITEM_3: "item_3", ITEM_4: "item_4", ITEM_5: "item_5" } as const;
export type paisesMundoType = typeof paisesMundo[keyof typeof paisesMundo];
export const paisesMundoLabels: Record<paisesMundoType, string> = { item_1: "Item 1", item_2: "Item 2", item_3: "Item 3", item_4: "Item 4", item_5: "Item 5" };
export const paisesMundoOptions = Object.entries(paisesMundoLabels).map(([value, label]) => ({ value, label }));
export function getpaisesMundoLabel(value: paisesMundoType): string { return paisesMundoLabels[value] || value; }
export default { values: paisesMundo, labels: paisesMundoLabels, options: paisesMundoOptions, getLabel: getpaisesMundoLabel };
