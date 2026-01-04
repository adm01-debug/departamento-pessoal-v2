export const coresPadrao = { ITEM_1: "item_1", ITEM_2: "item_2", ITEM_3: "item_3", ITEM_4: "item_4", ITEM_5: "item_5" } as const;
export type coresPadraoType = typeof coresPadrao[keyof typeof coresPadrao];
export const coresPadraoLabels: Record<coresPadraoType, string> = { item_1: "Item 1", item_2: "Item 2", item_3: "Item 3", item_4: "Item 4", item_5: "Item 5" };
export const coresPadraoOptions = Object.entries(coresPadraoLabels).map(([value, label]) => ({ value, label }));
export function getcoresPadraoLabel(value: coresPadraoType): string { return coresPadraoLabels[value] || value; }
export default { values: coresPadrao, labels: coresPadraoLabels, options: coresPadraoOptions, getLabel: getcoresPadraoLabel };
