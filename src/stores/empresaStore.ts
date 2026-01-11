// V15-295
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Empresa } from '@/types';
interface EmpresaState { empresas: Empresa[]; current: Empresa | null; setEmpresas: (e: Empresa[]) => void; setCurrent: (e: Empresa | null) => void; }
export const useEmpresaStore = create<EmpresaState>()(persist((set) => ({ empresas: [], current: null, setEmpresas: (empresas) => set({ empresas }), setCurrent: (current) => set({ current }) }), { name: 'empresa-storage' }));
