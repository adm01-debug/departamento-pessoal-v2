// V20-UTIL005: Notification Helpers
export type NotificationType = "success" | "error" | "warning" | "info";

export const createNotification = (type: NotificationType, message: string, title?: string) => {
  return { id: crypto.randomUUID(), type, message, title, timestamp: new Date() };
};

export const formatNotificationMessage = (template: string, data: Record<string, any>) => {
  return template.replace(/\{(\w+)\}/g, (_, key) => data[key] || "");
};

export const getNotificationIcon = (type: NotificationType) => {
  const icons = { success: "check-circle", error: "x-circle", warning: "alert-triangle", info: "info" };
  return icons[type];
};
