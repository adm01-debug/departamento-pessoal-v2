export const mensagensPadrao = { ITEM_1: "item_1", ITEM_2: "item_2", ITEM_3: "item_3", ITEM_4: "item_4", ITEM_5: "item_5" } as const;
export type mensagensPadraoType = typeof mensagensPadrao[keyof typeof mensagensPadrao];
export const mensagensPadraoLabels: Record<mensagensPadraoType, string> = { item_1: "Item 1", item_2: "Item 2", item_3: "Item 3", item_4: "Item 4", item_5: "Item 5" };
export const mensagensPadraoOptions = Object.entries(mensagensPadraoLabels).map(([value, label]) => ({ value, label }));
export function getmensagensPadraoLabel(value: mensagensPadraoType): string { return mensagensPadraoLabels[value] || value; }
export default { values: mensagensPadrao, labels: mensagensPadraoLabels, options: mensagensPadraoOptions, getLabel: getmensagensPadraoLabel };
