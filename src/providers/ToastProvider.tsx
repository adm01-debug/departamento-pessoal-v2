// V15-350
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
export function ToastProvider({ children }: { children: React.ReactNode }) {
  return <>{children}<Toaster /><Sonner /></>;
}
