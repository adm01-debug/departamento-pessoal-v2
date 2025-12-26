export const encodeBase64 = (str: string) => btoa(encodeURIComponent(str));
export const decodeBase64 = (str: string) => decodeURIComponent(atob(str));
export const simpleHash = (str: string) => { let hash = 0; for (let i = 0; i < str.length; i++) { hash = ((hash << 5) - hash) + str.charCodeAt(i); hash |= 0; } return hash.toString(16); };
