export const imageOptimization = {
  getOptimizedUrl(url: string, width: number, quality = 80): string {
    if (url.includes('supabase')) {
      return `${url}?width=${width}&quality=${quality}`;
    }
    return url;
  },

  getResponsiveSrcSet(url: string, widths = [320, 640, 768, 1024, 1280]): string {
    return widths.map(w => `${this.getOptimizedUrl(url, w)} ${w}w`).join(', ');
  },

  preloadImage(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = url;
    });
  },
};
export default imageOptimization;
