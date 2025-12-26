import { createContext, useContext, useState, ReactNode } from 'react';
interface SearchContextType { query: string; setQuery: (q: string) => void; results: any[]; setResults: (r: any[]) => void; isSearching: boolean; setIsSearching: (s: boolean) => void; }
const SearchContext = createContext<SearchContextType | undefined>(undefined);
export function SearchProvider({ children }: { children: ReactNode }) { const [query, setQuery] = useState(''); const [results, setResults] = useState<any[]>([]); const [isSearching, setIsSearching] = useState(false); return <SearchContext.Provider value={{ query, setQuery, results, setResults, isSearching, setIsSearching }}>{children}</SearchContext.Provider>; }
export function useSearch() { const ctx = useContext(SearchContext); if (!ctx) throw new Error('useSearch must be used within SearchProvider'); return ctx; }
