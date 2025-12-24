import { SEOHead } from '@/components/SEOHead';
import { useLocation } from "react-router-dom";
import { logger } from '@/lib/logger';
import { useEffect } from "react";

const NotFound = () => {
  useEffect(() => { document.title = 'Página não encontrada | DP System'; }, []);

  const location = useLocation();

  useEffect(() => {
    logger.error('Error', "404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
      <>
        <SEOHead title="Página não encontrada" description="Erro 404" />
        <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        <a href="/" className="text-primary underline hover:text-primary/90">
          Return to Home
        </a>
      </div>
    </div>
  
      </>);
};

export default NotFound;





