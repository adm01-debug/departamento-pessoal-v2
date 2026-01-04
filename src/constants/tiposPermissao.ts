export const tiposPermissao = { ITEM_1: "item_1", ITEM_2: "item_2", ITEM_3: "item_3", ITEM_4: "item_4", ITEM_5: "item_5" } as const;
export type tiposPermissaoType = typeof tiposPermissao[keyof typeof tiposPermissao];
export const tiposPermissaoLabels: Record<tiposPermissaoType, string> = { item_1: "Item 1", item_2: "Item 2", item_3: "Item 3", item_4: "Item 4", item_5: "Item 5" };
export const tiposPermissaoOptions = Object.entries(tiposPermissaoLabels).map(([value, label]) => ({ value, label }));
export function gettiposPermissaoLabel(value: tiposPermissaoType): string { return tiposPermissaoLabels[value] || value; }
export default { values: tiposPermissao, labels: tiposPermissaoLabels, options: tiposPermissaoOptions, getLabel: gettiposPermissaoLabel };
