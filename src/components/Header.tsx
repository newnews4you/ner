import { Sparkles, Bell, User, MessageCircle, Settings, LogOut, Home } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getUnreadCount } from "@/utils/notificationUtils";
import useLocalStorage from "@/hooks/useLocalStorage";
import { Notification } from "@/utils/notificationUtils";

interface HeaderProps {
  onChatToggle?: () => void;
  isChatOpen?: boolean;
  onNotificationClick?: () => void;
}

const Header = ({ onChatToggle, isChatOpen, onNotificationClick }: HeaderProps) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications] = useLocalStorage<Notification[]>("notifications", []);
  const unreadCount = getUnreadCount(notifications);
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";

  return (
    <header className="flex items-center justify-between py-6 mb-8 relative">
      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center shadow-sm hover:bg-black transition-all hover:-translate-y-0.5 active:scale-95 cursor-pointer"
        >
          <Sparkles className="w-5 h-5 text-white" />
        </Link>
        <div>
          <Link to="/" className="block">
            <h1 className="text-xl font-bold text-gray-900 tracking-tight hover:text-gray-700 transition-colors">Mano AI</h1>
            <p className="text-xs text-gray-500 font-medium hidden sm:block">Mokymosi platforma</p>
          </Link>
        </div>
        {isDashboard && (
          <Link
            to="/"
            className="ml-4 px-3 py-1.5 rounded-md bg-white hover:bg-gray-50 border border-gray-200 text-sm text-gray-700 font-medium transition-all flex items-center gap-2 shadow-sm"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Pagrindinis</span>
          </Link>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Mobile Chat Toggle */}
        <button
          onClick={onChatToggle}
          className={`lg:hidden w-10 h-10 rounded-lg transition-all flex items-center justify-center relative ${isChatOpen
            ? 'bg-gray-900 shadow-sm'
            : 'bg-white hover:bg-gray-50 border border-gray-200'
            }`}
        >
          <MessageCircle className={`w-5 h-5 ${isChatOpen ? 'text-white' : 'text-gray-500'}`} />
          {!isChatOpen && (
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
          )}
        </button>

        {/* Notifications */}
        <button
          onClick={onNotificationClick}
          className="w-10 h-10 rounded-lg bg-white hover:bg-gray-50 border border-gray-200 transition-all flex items-center justify-center relative group shadow-sm"
        >
          <Bell className="w-5 h-5 text-gray-500 group-hover:text-gray-900 transition-colors" />
          {unreadCount > 0 && (
            <>
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            </>
          )}
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white hover:bg-gray-50 border border-gray-200 transition-all group shadow-sm"
          >
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
              <User className="w-4 h-4 text-gray-600" />
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-semibold text-gray-900">Jonas</p>
              <p className="text-xs text-gray-500 font-medium">10a klasė</p>
            </div>
          </button>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute right-0 top-full mt-2 z-50 w-48 bg-white rounded-xl border border-gray-200 p-2 shadow-xl animate-scale-in">
                <div className="px-3 py-2 border-b border-gray-100 mb-1">
                  <p className="text-sm font-medium text-gray-900">Jonas</p>
                  <p className="text-xs text-gray-500">jonas@example.com</p>
                </div>
                <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Nustatymai
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  Atsijungti
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
