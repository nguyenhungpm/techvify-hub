import { Bell, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { usePortalStore } from "@/store/portalStore";
import { currentUser } from "@/lib/mockData";

export function TopBar() {
  const notifications = usePortalStore((s) => s.notifications);
  return (
    <header className="sticky top-0 z-50 h-14 bg-gradient-topbar text-white shadow-elevated">
      <div className="flex h-full items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[hsl(var(--destructive))] font-extrabold text-white text-sm" style={{ clipPath: "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)" }}>
            T
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-extrabold tracking-wide text-base">TECHVIFY</span>
            <span className="text-brand-soft/70">·</span>
            <span className="text-brand-soft text-sm">my.techvify.com</span>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <button className="relative grid h-9 w-9 place-items-center rounded-full hover:bg-white/10 transition">
            <Bell className="h-[18px] w-[18px]" />
            {notifications > 0 && (
              <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-[hsl(var(--destructive))] px-1 text-[10px] font-bold">
                {notifications}
              </span>
            )}
          </button>
          <button className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold hover:bg-white/15 transition">
            <span>🇻🇳</span><span>VN</span>
            <ChevronDown className="h-3 w-3" />
          </button>
          <button className="flex items-center gap-2 rounded-full pr-2 pl-0.5 py-0.5 hover:bg-white/10 transition">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-white/20 text-xs font-bold">
              NT
            </div>
            <span className="text-sm font-medium hidden md:block">{currentUser.name.split(" ").slice(-1)}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
