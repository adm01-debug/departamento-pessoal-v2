import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { useNotifications } from "@/contexts/NotificationContext";
import { NotificationList } from "./NotificationList";
export function NotificationBell() {
  const { unreadCount } = useNotifications();
  return (<Popover><PopoverTrigger asChild><Button variant="ghost" size="icon" className="relative"><Bell className="h-5 w-5" />{unreadCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{unreadCount > 9 ? "9+" : unreadCount}</span>}</Button></PopoverTrigger><PopoverContent className="w-80 p-0" align="end"><NotificationList /></PopoverContent></Popover>);
}
export default NotificationBell;
