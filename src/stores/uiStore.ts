// V15-293
import { create } from 'zustand';
interface UIState { sidebarOpen: boolean; theme: 'light' | 'dark'; loading: boolean; toggleSidebar: () => void; setTheme: (t: 'light' | 'dark') => void; setLoading: (l: boolean) => void; }
export const useUIStore = create<UIState>((set) => ({ sidebarOpen: true, theme: 'light', loading: false, toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })), setTheme: (theme) => set({ theme }), setLoading: (loading) => set({ loading }) }));
