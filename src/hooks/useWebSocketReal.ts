// V18-H008: Hook WebSocket Real-time
import { useState, useCallback, useEffect, useRef } from "react";

export type WSStatus = "connecting" | "connected" | "disconnected" | "error";

export interface WSMessage {
  tipo: string;
  dados: unknown;
  timestamp: string;
}

export function useWebSocketReal(url?: string) {
  const [status, setStatus] = useState<WSStatus>("disconnected");
  const [mensagens, setMensagens] = useState<WSMessage[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  const conectar = useCallback((wsUrl: string) => {
    setStatus("connecting");
    wsRef.current = new WebSocket(wsUrl);
    
    wsRef.current.onopen = () => setStatus("connected");
    wsRef.current.onclose = () => setStatus("disconnected");
    wsRef.current.onerror = () => setStatus("error");
    wsRef.current.onmessage = (e) => {
      const msg = JSON.parse(e.data) as WSMessage;
      setMensagens(prev => [...prev, msg]);
    };
  }, []);

  const desconectar = useCallback(() => {
    wsRef.current?.close();
    setStatus("disconnected");
  }, []);

  const enviar = useCallback((tipo: string, dados: unknown) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ tipo, dados, timestamp: new Date().toISOString() }));
    }
  }, []);

  useEffect(() => {
    if (url) conectar(url);
    return () => desconectar();
  }, [url, conectar, desconectar]);

  return { status, mensagens, conectar, desconectar, enviar };
}

export default useWebSocketReal;
