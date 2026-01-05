import { toast } from "sonner";

type NotificationType = "success" | "error" | "warning" | "info";

interface NotificationOptions {
  title?: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const notificationService = {
  show(type: NotificationType, message: string, options?: NotificationOptions) {
    const { title, description, duration = 4000, action } = options || {};
    
    const toastOptions = {
      description: description || message,
      duration,
      action: action ? { label: action.label, onClick: action.onClick } : undefined,
    };

    switch (type) {
      case "success":
        toast.success(title || "Sucesso", toastOptions);
        break;
      case "error":
        toast.error(title || "Erro", toastOptions);
        break;
      case "warning":
        toast.warning(title || "Atenção", toastOptions);
        break;
      case "info":
        toast.info(title || "Informação", toastOptions);
        break;
    }
  },

  success(message: string, options?: NotificationOptions) {
    this.show("success", message, options);
  },

  error(message: string, options?: NotificationOptions) {
    this.show("error", message, options);
  },

  warning(message: string, options?: NotificationOptions) {
    this.show("warning", message, options);
  },

  info(message: string, options?: NotificationOptions) {
    this.show("info", message, options);
  },

  promise<T>(
    promise: Promise<T>,
    messages: { loading: string; success: string; error: string }
  ) {
    return toast.promise(promise, messages);
  },

  dismiss(id?: string | number) {
    if (id) toast.dismiss(id);
    else toast.dismiss();
  },
};

export default notificationService;
