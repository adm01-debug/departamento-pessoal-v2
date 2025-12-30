/**
 * @fileoverview Hook para SEO
 * @module hooks/useSEO
 */
import { useEffect } from 'react';

export interface SEOConfig {
  title: string;
  description?: string;
  keywords?: string[];
}

export function useSEO(config: SEOConfig) {
  useEffect(() => {
    document.title = `${config.title} | DP System`;
    
    if (config.description) {
      let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'description';
        document.head.appendChild(meta);
      }
      meta.content = config.description;
    }
    
    if (config.keywords?.length) {
      let meta = document.querySelector('meta[name="keywords"]') as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'keywords';
        document.head.appendChild(meta);
      }
      meta.content = config.keywords.join(', ');
    }
  }, [config.title, config.description, config.keywords]);
}

export default useSEO;
