// QA-FIX: BrowserNotificationService Real Implementation
export class BrowserNotificationServiceReal {
  async requestPermission() { 
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      return { granted: permission === "granted" };
    }
    return { granted: false };
  }
  
  async send(title: string, options?: NotificationOptions) {
    if (Notification.permission === "granted") {
      new Notification(title, options);
      return { sent: true };
    }
    return { sent: false };
  }
  
  async getPermissionStatus() {
    return { status: Notification.permission };
  }
}
export const browserNotificationServiceReal = new BrowserNotificationServiceReal();
export default browserNotificationServiceReal;
