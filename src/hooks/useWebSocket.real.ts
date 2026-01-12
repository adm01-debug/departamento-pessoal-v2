// V18-H008: useWebSocket Real
import { useState, useEffect, useCallback, useRef } from "react";
export function useWebSocketReal(url: string) {
  const [conectado, setConectado] = useState(false);
  const [mensagens, setMensagens] = useState<string[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  useEffect(() => {
    const ws = new WebSocket(url);
    ws.onopen = () => setConectado(true);
    ws.onclose = () => setConectado(false);
    ws.onmessage = (e) => setMensagens(m => [...m, e.data]);
    wsRef.current = ws;
    return () => ws.close();
  }, [url]);
  const enviar = useCallback((msg: string) => wsRef.current?.send(msg), []);
  return { conectado, mensagens, enviar };
}
export default useWebSocketReal;
