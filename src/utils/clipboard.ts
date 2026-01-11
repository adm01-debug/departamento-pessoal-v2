// V15-CLIPBOARD: Clipboard utility functions

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    return true;
  } catch {
    return false;
  }
}

export async function readFromClipboard(): Promise<string | null> {
  try {
    if (navigator.clipboard) {
      return await navigator.clipboard.readText();
    }
    return null;
  } catch {
    return null;
  }
}

export function copyTableToClipboard(
  headers: string[],
  data: any[][]
): Promise<boolean> {
  const rows = [headers.join('\t'), ...data.map((row) => row.join('\t'))];
  return copyToClipboard(rows.join('\n'));
}

export async function copyFormattedText(html: string): Promise<boolean> {
  try {
    if (navigator.clipboard && 'write' in navigator.clipboard) {
      const blob = new Blob([html], { type: 'text/html' });
      const item = new ClipboardItem({ 'text/html': blob });
      await navigator.clipboard.write([item]);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}
