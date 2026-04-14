import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/store";
import { Bell, Search, Menu, X, Check } from "lucide-react";

const TopNavbar = () => {
  const { notifications, markNotificationRead, clearNotifications, sidebarOpen, setSidebarOpen, adminUser } = useStore();
  const [showNotif, setShowNotif] = useState(false);
  const [search, setSearch] = useState("");
  const notifRef = useRef<HTMLDivElement>(null);
  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotif(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="h-16 flex items-center justify-between px-4 lg:px-6 border-b border-border/50 glass-strong sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden p-2 rounded-lg hover:bg-secondary text-muted-foreground"
        >
          <Menu size={20} />
        </button>

        <div className="relative hidden sm:block">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="pl-9 pr-4 py-2 rounded-xl bg-secondary/60 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 w-64 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowNotif(!showNotif)}
            className="relative p-2 rounded-xl hover:bg-secondary text-muted-foreground transition-colors"
          >
            <Bell size={20} />
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-gradient-primary text-[10px] flex items-center justify-center text-primary-foreground font-bold">
                {unread}
              </span>
            )}
          </motion.button>

          <AnimatePresence>
            {showNotif && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 top-12 w-80 glass-strong rounded-2xl border border-border/50 overflow-hidden shadow-2xl"
              >
                <div className="flex items-center justify-between p-4 border-b border-border/50">
                  <span className="font-semibold text-sm text-foreground">Notifications</span>
                  <button onClick={clearNotifications} className="text-xs text-muted-foreground hover:text-foreground">
                    Clear all
                  </button>
                </div>
                <div className="max-h-64 overflow-y-auto scrollbar-thin">
                  {notifications.length === 0 ? (
                    <p className="p-4 text-sm text-muted-foreground text-center">No notifications</p>
                  ) : (
                    notifications.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`w-full text-left p-3 hover:bg-secondary/50 transition-colors border-b border-border/30 ${
                          !n.read ? "bg-primary/5" : ""
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <div
                            className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                              n.type === "success"
                                ? "bg-success"
                                : n.type === "warning"
                                ? "bg-warning"
                                : n.type === "error"
                                ? "bg-destructive"
                                : "bg-neon-cyan"
                            }`}
                          />
                          <div>
                            <p className="text-sm font-medium text-foreground">{n.title}</p>
                            <p className="text-xs text-muted-foreground">{n.message}</p>
                            <p className="text-xs text-muted-foreground/60 mt-1">{n.time}</p>
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
            {adminUser?.name?.[0] || "A"}
          </div>
          <span className="text-sm font-medium text-foreground hidden sm:block">{adminUser?.name || "Admin"}</span>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
