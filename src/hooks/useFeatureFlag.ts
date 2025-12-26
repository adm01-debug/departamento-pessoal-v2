import { useState, useEffect } from 'react';
const flags: Record<string, boolean> = { darkMode: true, newDashboard: false, exportPdf: true };
export function useFeatureFlag(flag: string) {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => { setEnabled(flags[flag] ?? false); }, [flag]);
  return enabled;
}
