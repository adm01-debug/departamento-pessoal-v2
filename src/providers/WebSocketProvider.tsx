import React, { createContext, useContext, useEffect, useState } from "react";
interface WebSocketContextType { isConnected: boolean; send: (message: any) => void; lastMessage: any; subscribe: (event: string, callback: (data: any) => void) => () => void; }
const WebSocketContext = createContext<WebSocketContextType | null>(null);
export function WebSocketProvider({ children, url }: { children: React.ReactNode; url: string }) {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const [subscribers, setSubscribers] = useState<Map<string, Set<(data: any) => void>>>(new Map());
  useEffect(() => { const socket = new WebSocket(url); socket.onopen = () => setIsConnected(true); socket.onclose = () => setIsConnected(false); socket.onmessage = (event) => { const data = JSON.parse(event.data); setLastMessage(data); const eventSubscribers = subscribers.get(data.type); if (eventSubscribers) eventSubscribers.forEach(cb => cb(data.payload)); }; setWs(socket); return () => socket.close(); }, [url]);
  const send = (message: any) => ws?.send(JSON.stringify(message));
  const subscribe = (event: string, callback: (data: any) => void) => { setSubscribers(prev => { const newMap = new Map(prev); if (!newMap.has(event)) newMap.set(event, new Set()); newMap.get(event)!.add(callback); return newMap; }); return () => { setSubscribers(prev => { const newMap = new Map(prev); newMap.get(event)?.delete(callback); return newMap; }); }; };
  return <WebSocketContext.Provider value={{ isConnected, send, lastMessage, subscribe }}>{children}</WebSocketContext.Provider>;
}
export const useWebSocket = () => { const ctx = useContext(WebSocketContext); if (!ctx) throw new Error("useWebSocket must be used within WebSocketProvider"); return ctx; };
