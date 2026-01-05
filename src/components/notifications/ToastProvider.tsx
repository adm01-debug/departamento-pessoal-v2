import React, { useEffect } from "react";
import { Toaster as SonnerToaster, toast } from "sonner";
export { toast };
interface ToastOptions { title: string; description?: string; duration?: number; action?: { label: string; onClick: () => void }; }
export const showToast = { success: (options: ToastOptions) => toast.success(options.title, { description: options.description, duration: options.duration, action: options.action ? { label: options.action.label, onClick: options.action.onClick } : undefined }),
  error: (options: ToastOptions) => toast.error(options.title, { description: options.description, duration: options.duration }),
  warning: (options: ToastOptions) => toast.warning(options.title, { description: options.description, duration: options.duration }),
  info: (options: ToastOptions) => toast.info(options.title, { description: options.description, duration: options.duration }),
  loading: (title: string) => toast.loading(title),
  dismiss: (id?: string | number) => toast.dismiss(id),
  promise: <T,>(promise: Promise<T>, msgs: { loading: string; success: string; error: string }) => toast.promise(promise, msgs) };
export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (<>{children}<SonnerToaster position="top-right" richColors closeButton /></>);
}
export default ToastProvider;
