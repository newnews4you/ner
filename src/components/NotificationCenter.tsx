import { useState, useEffect } from "react";
import { Bell, X, Check, CheckCheck, Info, CheckCircle2, AlertTriangle, XCircle, Trophy } from "lucide-react";
import { Notification, getUnreadCount, markAsRead, markAllAsRead, createNotification } from "@/utils/notificationUtils";
import useLocalStorage from "@/hooks/useLocalStorage";

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationCenter = ({ isOpen, onClose }: NotificationCenterProps) => {
  const [notifications, setNotifications] = useLocalStorage<Notification[]>("notifications", []);
  const [filter, setFilter] = useState<"all" | "unread">("unread");

  const unreadCount = getUnreadCount(notifications);
  const filteredNotifications = filter === "unread"
    ? notifications.filter(n => !n.read)
    : notifications;

  const handleMarkAsRead = (id: string) => {
    setNotifications(markAsRead(notifications, id));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(markAllAsRead(notifications));
  };

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-green-400" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-orange-400" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-400" />;
      case "achievement":
        return <Trophy className="w-5 h-5 text-yellow-400" />;
      default:
        return <Info className="w-5 h-5 text-cyan-400" />;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Dabar";
    if (minutes < 60) return `Prieš ${minutes} min`;
    if (hours < 24) return `Prieš ${hours} val.`;
    if (days < 7) return `Prieš ${days} d.`;
    return date.toLocaleDateString("lt-LT");
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-96 z-50 bg-white border-l border-gray-200 shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-100 bg-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center shadow-sm">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-900 tracking-tight">Pranešimai</h2>
                  <p className="text-xs text-gray-500 font-medium">
                    {unreadCount} neperskaitytų
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Filters and Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilter("unread")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${filter === "unread"
                    ? "bg-gray-900 text-white shadow-sm"
                    : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
              >
                Neperskaityti ({unreadCount})
              </button>
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${filter === "all"
                    ? "bg-gray-900 text-white shadow-sm"
                    : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
              >
                Visi ({notifications.length})
              </button>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="ml-auto px-3 py-1.5 rounded-md text-xs bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all flex items-center gap-1"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Pažymėti visus
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin bg-gray-50/30">
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <Bell className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  Nėra pranešimų
                </p>
                <p className="text-xs text-gray-500 font-medium">
                  {filter === "unread" ? "Visi pranešimai perskaityti" : "Pranešimų nėra"}
                </p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-xl border transition-all ${notification.read
                      ? "bg-white border-gray-100 opacity-60"
                      : "bg-white border-gray-200 shadow-sm"
                    } hover:shadow-md cursor-pointer group`}
                  onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="text-sm font-semibold text-gray-900">
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2 leading-relaxed">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-gray-400 font-medium">
                          {formatTime(notification.timestamp)}
                        </span>
                        <div className="flex items-center gap-1">
                          {!notification.read && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(notification.id);
                              }}
                              className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                              title="Pažymėti kaip perskaitytą"
                            >
                              <Check className="w-3.5 h-3.5 text-gray-500" />
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(notification.id);
                            }}
                            className="p-1 rounded-md hover:bg-gray-100 transition-colors"
                            title="Ištrinti"
                          >
                            <X className="w-3.5 h-3.5 text-gray-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationCenter;
export { createNotification };

