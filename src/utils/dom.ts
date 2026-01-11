// V15-151: src/utils/dom.ts
export function scrollToTop(smooth = true): void {
  window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });
}

export function scrollToElement(selector: string, offset = 0): void {
  const el = document.querySelector(selector);
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

export function copyToClipboard(text: string): Promise<boolean> {
  return navigator.clipboard.writeText(text).then(() => true).catch(() => false);
}

export function downloadFile(url: string, filename: string): void {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  downloadFile(url, filename);
  URL.revokeObjectURL(url);
}

export function getScrollPosition(): { x: number; y: number } {
  return { x: window.scrollX, y: window.scrollY };
}

export function isElementInViewport(el: Element): boolean {
  const rect = el.getBoundingClientRect();
  return rect.top >= 0 && rect.left >= 0 && rect.bottom <= window.innerHeight && rect.right <= window.innerWidth;
}

export function focusElement(selector: string): void {
  const el = document.querySelector<HTMLElement>(selector);
  el?.focus();
}

export function addClass(el: Element, ...classes: string[]): void {
  el.classList.add(...classes);
}

export function removeClass(el: Element, ...classes: string[]): void {
  el.classList.remove(...classes);
}

export function toggleClass(el: Element, className: string): void {
  el.classList.toggle(className);
}
