export function capitalize(str: string): string { return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase(); }
export function titleCase(str: string): string { return str.split(" ").map(capitalize).join(" "); }
export function slugify(str: string): string { return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
export function truncate(str: string, length: number, suffix = "..."): string { return str.length > length ? str.slice(0, length) + suffix : str; }
export function removeAccents(str: string): string { return str.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); }
export function extractInitials(name: string, count = 2): string { return name.split(" ").map(w => w[0]).slice(0, count).join("").toUpperCase(); }
export default { capitalize, titleCase, slugify, truncate, removeAccents, extractInitials };
