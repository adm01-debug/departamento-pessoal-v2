export const iconesPadrao = { ITEM_1: "item_1", ITEM_2: "item_2", ITEM_3: "item_3", ITEM_4: "item_4", ITEM_5: "item_5" } as const;
export type iconesPadraoType = typeof iconesPadrao[keyof typeof iconesPadrao];
export const iconesPadraoLabels: Record<iconesPadraoType, string> = { item_1: "Item 1", item_2: "Item 2", item_3: "Item 3", item_4: "Item 4", item_5: "Item 5" };
export const iconesPadraoOptions = Object.entries(iconesPadraoLabels).map(([value, label]) => ({ value, label }));
export function geticonesPadraoLabel(value: iconesPadraoType): string { return iconesPadraoLabels[value] || value; }
export default { values: iconesPadrao, labels: iconesPadraoLabels, options: iconesPadraoOptions, getLabel: geticonesPadraoLabel };
