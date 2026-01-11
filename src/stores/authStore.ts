// V15-294
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
interface User { id: string; email: string; name?: string; role?: string; }
interface AuthState { user: User | null; token: string | null; setUser: (u: User | null) => void; setToken: (t: string | null) => void; logout: () => void; }
export const useAuthStore = create<AuthState>()(persist((set) => ({ user: null, token: null, setUser: (user) => set({ user }), setToken: (token) => set({ token }), logout: () => set({ user: null, token: null }) }), { name: 'auth-storage' }));
