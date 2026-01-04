export const fusoHorarios = { ITEM_1: "item_1", ITEM_2: "item_2", ITEM_3: "item_3", ITEM_4: "item_4", ITEM_5: "item_5" } as const;
export type fusoHorariosType = typeof fusoHorarios[keyof typeof fusoHorarios];
export const fusoHorariosLabels: Record<fusoHorariosType, string> = { item_1: "Item 1", item_2: "Item 2", item_3: "Item 3", item_4: "Item 4", item_5: "Item 5" };
export const fusoHorariosOptions = Object.entries(fusoHorariosLabels).map(([value, label]) => ({ value, label }));
export function getfusoHorariosLabel(value: fusoHorariosType): string { return fusoHorariosLabels[value] || value; }
export default { values: fusoHorarios, labels: fusoHorariosLabels, options: fusoHorariosOptions, getLabel: getfusoHorariosLabel };
