export const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
export const scrollToElement = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
export const copyToClipboard = async (text: string) => { await navigator.clipboard.writeText(text); };
export const downloadBlob = (blob: Blob, filename: string) => { const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url); };
export const focusFirstInput = (container: HTMLElement) => container.querySelector('input, textarea, select')?.focus();
