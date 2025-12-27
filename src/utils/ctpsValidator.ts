export const validateCTPS = (ctps: string, serie: string): boolean => { return ctps.length >= 5 && serie.length >= 4 && /^\d+$/.test(ctps) && /^\d+$/.test(serie); };
