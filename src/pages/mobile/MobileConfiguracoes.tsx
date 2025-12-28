import React from 'react';
import { MobileNavigation } from '@/components/mobile/MobileNavigation';
import { MobileCard } from '@/components/mobile/MobileCard';

/**
 * Configurações - Versão Mobile
 */
export const MobileConfiguracoes: React.FC = () => {
  return (
    <div className="min-h-screen bg-background pb-16">
      <header className="sticky top-0 z-50 bg-background border-b p-4">
        <h1 className="text-xl font-bold">Configurações</h1>
      </header>
      <main className="p-4 space-y-4">
        <MobileCard className="p-4">
          <p className="text-muted-foreground">Conteúdo de Configurações</p>
        </MobileCard>
      </main>
      <MobileNavigation />
    </div>
  );
};

export default MobileConfiguracoes;
