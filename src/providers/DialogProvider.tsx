import React, { createContext, useContext, useState, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Info, CheckCircle, XCircle } from "lucide-react";
interface DialogConfig { type: "confirm" | "alert" | "info" | "success" | "error"; title: string; message: string; confirmLabel?: string; cancelLabel?: string; onConfirm?: () => void | Promise<void>; onCancel?: () => void; }
interface DialogContextType { confirm: (config: Omit<DialogConfig, "type">) => Promise<boolean>; alert: (title: string, message: string) => void; info: (title: string, message: string) => void; success: (title: string, message: string) => void; error: (title: string, message: string) => void; }
const DialogContext = createContext<DialogContextType | null>(null);
const icons = { confirm: AlertTriangle, alert: AlertTriangle, info: Info, success: CheckCircle, error: XCircle };
const iconColors = { confirm: "text-yellow-500", alert: "text-yellow-500", info: "text-blue-500", success: "text-green-500", error: "text-red-500" };
export function DialogProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<DialogConfig | null>(null);
  const [resolveRef, setResolveRef] = useState<((value: boolean) => void) | null>(null);
  const confirm = useCallback((cfg: Omit<DialogConfig, "type">) => new Promise<boolean>((resolve) => { setConfig({ ...cfg, type: "confirm" }); setResolveRef(() => resolve); }), []);
  const showDialog = useCallback((type: DialogConfig["type"], title: string, message: string) => { setConfig({ type, title, message }); }, []);
  const handleClose = (result: boolean) => { resolveRef?.(result); setConfig(null); setResolveRef(null); };
  const Icon = config ? icons[config.type] : null;
  return (
    <DialogContext.Provider value={{ confirm, alert: (t, m) => showDialog("alert", t, m), info: (t, m) => showDialog("info", t, m), success: (t, m) => showDialog("success", t, m), error: (t, m) => showDialog("error", t, m) }}>{children}<Dialog open={!!config} onOpenChange={() => handleClose(false)}><DialogContent><DialogHeader>{Icon && <Icon className={`h-12 w-12 mx-auto mb-4 ${iconColors[config?.type || "info"]}`} />}<DialogTitle>{config?.title}</DialogTitle><DialogDescription>{config?.message}</DialogDescription></DialogHeader>{config?.type === "confirm" ? <DialogFooter><Button variant="outline" onClick={() => handleClose(false)}>{config.cancelLabel || "Cancelar"}</Button><Button onClick={() => handleClose(true)}>{config.confirmLabel || "Confirmar"}</Button></DialogFooter> : <DialogFooter><Button onClick={() => handleClose(true)}>OK</Button></DialogFooter>}</DialogContent></Dialog></DialogContext.Provider>
  );
}
export const useDialog = () => { const ctx = useContext(DialogContext); if (!ctx) throw new Error("useDialog must be used within DialogProvider"); return ctx; };
