export const horasDia = { ITEM_1: "item_1", ITEM_2: "item_2", ITEM_3: "item_3", ITEM_4: "item_4", ITEM_5: "item_5" } as const;
export type horasDiaType = typeof horasDia[keyof typeof horasDia];
export const horasDiaLabels: Record<horasDiaType, string> = { item_1: "Item 1", item_2: "Item 2", item_3: "Item 3", item_4: "Item 4", item_5: "Item 5" };
export const horasDiaOptions = Object.entries(horasDiaLabels).map(([value, label]) => ({ value, label }));
export function gethorasDiaLabel(value: horasDiaType): string { return horasDiaLabels[value] || value; }
export default { values: horasDia, labels: horasDiaLabels, options: horasDiaOptions, getLabel: gethorasDiaLabel };
