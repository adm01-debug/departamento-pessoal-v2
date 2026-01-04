export const prioridadesTarefa = { ITEM_1: "item_1", ITEM_2: "item_2", ITEM_3: "item_3", ITEM_4: "item_4", ITEM_5: "item_5" } as const;
export type prioridadesTarefaType = typeof prioridadesTarefa[keyof typeof prioridadesTarefa];
export const prioridadesTarefaLabels: Record<prioridadesTarefaType, string> = { item_1: "Item 1", item_2: "Item 2", item_3: "Item 3", item_4: "Item 4", item_5: "Item 5" };
export const prioridadesTarefaOptions = Object.entries(prioridadesTarefaLabels).map(([value, label]) => ({ value, label }));
export function getprioridadesTarefaLabel(value: prioridadesTarefaType): string { return prioridadesTarefaLabels[value] || value; }
export default { values: prioridadesTarefa, labels: prioridadesTarefaLabels, options: prioridadesTarefaOptions, getLabel: getprioridadesTarefaLabel };
