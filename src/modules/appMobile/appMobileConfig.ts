export interface PWAConfig { name: string; shortName: string; theme: string; features: string[]; }
export const APP_MOBILE_CONFIG: PWAConfig = { name: "DP Mobile", shortName: "DP", theme: "#3B82F6", features: ["holerite", "ponto", "ferias", "atestados", "comunicados"] };
export function checkPWASupport(): boolean { return "serviceWorker" in navigator && "PushManager" in window; }
export default APP_MOBILE_CONFIG;
