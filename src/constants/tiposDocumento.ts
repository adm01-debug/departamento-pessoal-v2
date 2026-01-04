export const tiposDocumento = { ITEM_1: "item_1", ITEM_2: "item_2", ITEM_3: "item_3", ITEM_4: "item_4", ITEM_5: "item_5" } as const;
export type tiposDocumentoType = typeof tiposDocumento[keyof typeof tiposDocumento];
export const tiposDocumentoLabels: Record<tiposDocumentoType, string> = { item_1: "Item 1", item_2: "Item 2", item_3: "Item 3", item_4: "Item 4", item_5: "Item 5" };
export const tiposDocumentoOptions = Object.entries(tiposDocumentoLabels).map(([value, label]) => ({ value, label }));
export function gettiposDocumentoLabel(value: tiposDocumentoType): string { return tiposDocumentoLabels[value] || value; }
export default { values: tiposDocumento, labels: tiposDocumentoLabels, options: tiposDocumentoOptions, getLabel: gettiposDocumentoLabel };
