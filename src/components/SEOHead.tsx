import { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description?: string;
  keywords?: string[];
  author?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
}

/**
 * Componente para gerenciar meta tags SEO
 */
export function SEOHead({
  title,
  description = 'Sistema de Departamento Pessoal - Gestão completa de RH',
  keywords = ['RH', 'Departamento Pessoal', 'Folha de Pagamento', 'eSocial'],
  author = 'DP System',
  image,
  url,
  type = 'website',
}: SEOHeadProps): null {
  useEffect(() => {
    // Title
    document.title = `${title} | DP System`;

    // Meta tags
    const metaTags: Record<string, string> = {
      description,
      keywords: keywords.join(', '),
      author,
      'og:title': title,
      'og:description': description,
      'og:type': type,
      'twitter:card': 'summary_large_image',
      'twitter:title': title,
      'twitter:description': description,
    };

    if (image) {
      metaTags['og:image'] = image;
      metaTags['twitter:image'] = image;
    }

    if (url) {
      metaTags['og:url'] = url;
    }

    // Atualizar ou criar meta tags
    Object.entries(metaTags).forEach(([name, content]) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.querySelector(`meta[property="${name}"]`) as HTMLMetaElement;
      }
      if (!meta) {
        meta = document.createElement('meta');
        if (name.startsWith('og:')) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    });

    return () => {
      // Cleanup não necessário pois queremos manter as tags
    };
  }, [title, description, keywords, author, image, url, type]);

  return null;
}

export default SEOHead;
