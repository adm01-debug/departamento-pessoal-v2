// V18-H009: useNotificacoesPush Real
import { useState, useCallback } from "react";
export function useNotificacoesPushReal() {
  const [permissao, setPermissao] = useState(Notification.permission);
  const solicitarPermissao = useCallback(async () => {
    const result = await Notification.requestPermission();
    setPermissao(result);
    return result === "granted";
  }, []);
  const enviar = useCallback((titulo: string, opcoes?: NotificationOptions) => {
    if (permissao === "granted") new Notification(titulo, opcoes);
  }, [permissao]);
  return { permissao, solicitarPermissao, enviar };
}
export default useNotificacoesPushReal;
