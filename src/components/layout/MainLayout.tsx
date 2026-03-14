// src/components/layout/MainLayout.tsx
import { useState, type ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileBottomNav } from './MobileBottomNav';
import { PageTransition } from './PageTransition';
import { CommandPalette } from '@/components/ui/command-palette';

interface MainLayoutProps {
  children?: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background">
      {/* Command Palette (global) */}
      <CommandPalette />

      <div className={cn('hidden lg:block transition-all duration-300', sidebarOpen ? 'w-64' : 'w-16')}>
        <Sidebar collapsed={!sidebarOpen} />
      </div>

      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setMobileSidebarOpen(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="absolute left-0 top-0 h-full w-64" onClick={(e) => e.stopPropagation()}>
            <Sidebar />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onMenuClick={() => setMobileSidebarOpen(true)}
          user={{ name: 'Admin', email: 'admin@empresa.com' }}
        />
        <main className="flex-1 overflow-auto p-page pb-20 lg:pb-page">
          <PageTransition>
            {children || <Outlet />}
          </PageTransition>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}
