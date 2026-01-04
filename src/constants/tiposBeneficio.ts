export const tiposBeneficio = { ITEM_1: "item_1", ITEM_2: "item_2", ITEM_3: "item_3", ITEM_4: "item_4", ITEM_5: "item_5" } as const;
export type tiposBeneficioType = typeof tiposBeneficio[keyof typeof tiposBeneficio];
export const tiposBeneficioLabels: Record<tiposBeneficioType, string> = { item_1: "Item 1", item_2: "Item 2", item_3: "Item 3", item_4: "Item 4", item_5: "Item 5" };
export const tiposBeneficioOptions = Object.entries(tiposBeneficioLabels).map(([value, label]) => ({ value, label }));
export function gettiposBeneficioLabel(value: tiposBeneficioType): string { return tiposBeneficioLabels[value] || value; }
export default { values: tiposBeneficio, labels: tiposBeneficioLabels, options: tiposBeneficioOptions, getLabel: gettiposBeneficioLabel };
