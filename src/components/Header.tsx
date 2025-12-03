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
    <header className="flex items-center justify-between py-4 lg:py-6 mb-4 lg:mb-8 animate-fade-in relative">
      <div className="flex items-center gap-2 sm:gap-3">
        <Link 
          to="/" 
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl gradient-purple-pink flex items-center justify-center shadow-lg shadow-primary/30 hover:scale-110 transition-transform cursor-pointer"
        >
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </Link>
        <div>
          <Link to="/" className="block">
            <h1 className="text-lg sm:text-xl font-bold text-foreground tracking-tight hover:opacity-80 transition-opacity">Mano AI</h1>
            <p className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block">Mokymosi platforma</p>
          </Link>
        </div>
        {isDashboard && (
          <Link
            to="/"
            className="ml-2 sm:ml-4 px-3 py-1.5 rounded-lg bg-secondary/50 hover:bg-secondary/70 border border-white/10 text-sm text-foreground transition-all flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Pagrindinis</span>
          </Link>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Chat Toggle */}
        <button 
          onClick={onChatToggle}
          className={`lg:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl transition-all flex items-center justify-center relative ${
            isChatOpen 
              ? 'gradient-purple-pink shadow-lg shadow-primary/30' 
              : 'bg-secondary/50 hover:bg-secondary'
          }`}
        >
          <MessageCircle className={`w-4 h-4 sm:w-5 sm:h-5 ${isChatOpen ? 'text-white' : 'text-muted-foreground'}`} />
          {!isChatOpen && (
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-primary animate-pulse" />
          )}
        </button>

        {/* Notifications */}
        <button 
          onClick={onNotificationClick}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-secondary/50 hover:bg-secondary transition-all flex items-center justify-center relative group"
        >
          <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          {unreadCount > 0 && (
            <>
              <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-2 h-2 rounded-full gradient-orange-red animate-pulse" />
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full gradient-orange-red flex items-center justify-center text-[10px] font-bold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            </>
          )}
        </button>
        
        {/* User Menu */}
        <div className="relative">
          <button 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-secondary/50 hover:bg-secondary transition-all group"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md sm:rounded-lg gradient-cyan-blue flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform">
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-medium text-foreground">Jonas</p>
              <p className="text-xs text-muted-foreground">10a klasė</p>
            </div>
          </button>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute right-0 top-full mt-2 z-50 w-48 glass rounded-xl border border-white/10 p-2 shadow-xl animate-scale-in">
                <div className="px-3 py-2 border-b border-white/10 mb-1">
                  <p className="text-sm font-medium text-foreground">Jonas</p>
                  <p className="text-xs text-muted-foreground">jonas@example.com</p>
                </div>
                <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-foreground hover:bg-secondary/70 transition-colors flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Nustatymai
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-foreground hover:bg-secondary/70 transition-colors flex items-center gap-2">
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
