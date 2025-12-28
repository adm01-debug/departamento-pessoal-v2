import React from 'react';
import { MobileNavigation } from '@/components/mobile/MobileNavigation';
import { MobileCard } from '@/components/mobile/MobileCard';

/**
 * Documentos - Versão Mobile
 */
export const MobileDocumentos: React.FC = () => {
  return (
    <div className="min-h-screen bg-background pb-16">
      <header className="sticky top-0 z-50 bg-background border-b p-4">
        <h1 className="text-xl font-bold">Documentos</h1>
      </header>
      <main className="p-4 space-y-4">
        <MobileCard className="p-4">
          <p className="text-muted-foreground">Conteúdo de Documentos</p>
        </MobileCard>
      </main>
      <MobileNavigation />
    </div>
  );
};

export default MobileDocumentos;
