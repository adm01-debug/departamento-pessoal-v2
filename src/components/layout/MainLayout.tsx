// src/components/layout/MainLayout.tsx
import { useState, type ReactNode, memo, useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileBottomNav } from './MobileBottomNav';
import { PageTransition } from './PageTransition';
import { CommandPalette } from '@/components/ui/command-palette';
import { GuidedTour } from '@/components/onboarding/GuidedTour';
import { useAuth } from '@/contexts/AuthContext';

interface MainLayoutProps {
  children?: ReactNode;
}

const MemoizedSidebar = memo(Sidebar);
const MemoizedHeader = memo(Header);

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { user, isReady } = useAuth();

  if (!isReady) return null; // Prevenção de flash de layout antes do carregamento da sessão

  return (
    <div className="flex h-screen bg-background">
      {/* Command Palette (global) */}
      <CommandPalette />

      {/* Guided Tour (first visit) */}
      <GuidedTour />

      <div className={cn('hidden md:block transition-all duration-500 ease-in-out', sidebarOpen ? 'w-64' : 'w-16')}>
        <MemoizedSidebar collapsed={!sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      </div>

      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setMobileSidebarOpen(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="absolute left-0 top-0 h-full w-64" onClick={(e) => e.stopPropagation()}>
            <MemoizedSidebar />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <MemoizedHeader
          onMenuClick={() => setMobileSidebarOpen(true)}
          user={useMemo(() => ({ name: user?.name || user?.email || 'Usuário', email: user?.email || '' }), [user])}
        />
        <main role="main" className="flex-1 overflow-auto p-page pb-20 lg:pb-page">
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-primary focus:text-primary-foreground">Pular para conteúdo</a>
          <div id="main-content">
            <PageTransition>
              {children || <Outlet />}
            </PageTransition>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}
