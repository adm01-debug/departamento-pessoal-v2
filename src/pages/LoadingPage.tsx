// V15-241: src/pages/LoadingPage.tsx
import { Spinner } from '@/components/ui/spinner';

export default function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="xl" />
        <p className="text-muted-foreground animate-pulse">Carregando...</p>
      </div>
    </div>
  );
}
