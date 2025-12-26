import { useEffect } from 'react';
export function useSEO(options: { title?: string; description?: string; keywords?: string }) {
  useEffect(() => { if (options.title) document.title = options.title; const metaDesc = document.querySelector('meta[name="description"]'); if (metaDesc && options.description) metaDesc.setAttribute('content', options.description); }, [options]);
}
