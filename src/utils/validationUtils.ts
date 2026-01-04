export function isRequired(value: any): boolean { return value !== null && value !== undefined && value !== ""; }
export function minLength(value: string, min: number): boolean { return value.length >= min; }
export function maxLength(value: string, max: number): boolean { return value.length <= max; }
export function isNumeric(value: string): boolean { return /^\d+$/.test(value); }
export function isAlphanumeric(value: string): boolean { return /^[a-zA-Z0-9]+$/.test(value); }
export function inRange(value: number, min: number, max: number): boolean { return value >= min && value <= max; }
export function matches(value: string, pattern: RegExp): boolean { return pattern.test(value); }
export function isPositive(value: number): boolean { return value > 0; }
export function isInteger(value: number): boolean { return Number.isInteger(value); }
export default { isRequired, minLength, maxLength, isNumeric, isAlphanumeric, inRange, matches, isPositive, isInteger };
