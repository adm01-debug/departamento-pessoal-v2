export const generateUUID = () => crypto.randomUUID();
export const isValidUUID = (uuid: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(uuid);
export const shortUUID = () => crypto.randomUUID().split('-')[0];
