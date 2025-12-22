import { useState, memo } from 'react';
import { Outlet } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import { GlobalSearch } from '@/components/GlobalSearch';

export function MainLayout() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar onSearchOpen={() => setSearchOpen(true)} />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
      <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  );
}

