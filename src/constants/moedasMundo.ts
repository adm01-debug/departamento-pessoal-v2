export const moedasMundo = { ITEM_1: "item_1", ITEM_2: "item_2", ITEM_3: "item_3", ITEM_4: "item_4", ITEM_5: "item_5" } as const;
export type moedasMundoType = typeof moedasMundo[keyof typeof moedasMundo];
export const moedasMundoLabels: Record<moedasMundoType, string> = { item_1: "Item 1", item_2: "Item 2", item_3: "Item 3", item_4: "Item 4", item_5: "Item 5" };
export const moedasMundoOptions = Object.entries(moedasMundoLabels).map(([value, label]) => ({ value, label }));
export function getmoedasMundoLabel(value: moedasMundoType): string { return moedasMundoLabels[value] || value; }
export default { values: moedasMundo, labels: moedasMundoLabels, options: moedasMundoOptions, getLabel: getmoedasMundoLabel };
