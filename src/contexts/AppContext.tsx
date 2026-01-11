// V15-107: src/contexts/AppContext.tsx
import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface AppState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  loading: boolean;
  notifications: Notification[];
  user: User | null;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

type AppAction =
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'SET_USER'; payload: User | null };

const initialState: AppState = {
  theme: 'light',
  sidebarOpen: true,
  loading: false,
  notifications: [],
  user: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_THEME': return { ...state, theme: action.payload };
    case 'TOGGLE_SIDEBAR': return { ...state, sidebarOpen: !state.sidebarOpen };
    case 'SET_LOADING': return { ...state, loading: action.payload };
    case 'ADD_NOTIFICATION': return { ...state, notifications: [...state.notifications, action.payload] };
    case 'REMOVE_NOTIFICATION': return { ...state, notifications: state.notifications.filter(n => n.id !== action.payload) };
    case 'SET_USER': return { ...state, user: action.payload };
    default: return state;
  }
}

const AppContext = createContext<{ state: AppState; dispatch: React.Dispatch<AppAction> } | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
}

export const useTheme = () => { const { state, dispatch } = useAppContext(); return { theme: state.theme, setTheme: (t: 'light'|'dark') => dispatch({ type: 'SET_THEME', payload: t }) }; };
export const useSidebar = () => { const { state, dispatch } = useAppContext(); return { open: state.sidebarOpen, toggle: () => dispatch({ type: 'TOGGLE_SIDEBAR' }) }; };
