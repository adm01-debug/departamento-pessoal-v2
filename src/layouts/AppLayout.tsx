// V15-516
import { Outlet } from 'react-router-dom';
import { Header, Sidebar, Footer } from '@/components/layout';
import { useUIStore } from '@/stores';
export function AppLayout() {
  const { sidebarOpen } = useUIStore();
  return (
    <div className="min-h-screen flex">
      <Sidebar collapsed={!sidebarOpen} />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6"><Outlet /></main>
        <Footer />
      </div>
    </div>
  );
}
