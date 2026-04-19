import { NavLink, useLocation } from "react-router-dom";
import {
  Home, User, Building2, Clock, Wallet, FileText, CheckSquare, Users,
  ChevronDown, ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { currentUser } from "@/lib/mockData";

interface NavItem {
  label: string;
  to?: string;
  icon?: any;
  children?: { label: string; to: string }[];
}

const sections: { items: NavItem[] }[] = [
  { items: [{ label: "Trang chủ", to: "/", icon: Home }] },
  {
    items: [
      { label: "My Profile", to: "/profile", icon: User },
      { label: "My Department", to: "/department", icon: Building2 },
    ],
  },
  {
    items: [
      {
        label: "Attendance", icon: Clock,
        children: [
          { label: "My Attendance", to: "/attendance/me" },
          { label: "Emp Attendance", to: "/attendance/team" },
        ],
      },
      { label: "Payslip", to: "/payslip", icon: Wallet },
    ],
  },
  {
    items: [
      {
        label: "Request", icon: FileText,
        children: [
          { label: "My Request", to: "/request/my" },
          { label: "My Approval", to: "/request/approval" },
        ],
      },
    ],
  },
  {
    items: [
      {
        label: "My Task", icon: CheckSquare,
        children: [
          { label: "C&B", to: "/task/cb" },
          { label: "ITS", to: "/task/its" },
          { label: "Admin", to: "/task/admin" },
        ],
      },
    ],
  },
  {
    items: [
      {
        label: "PPL / HR", icon: Users,
        children: [
          { label: "Danh sách Offboarding", to: "/ppl/list" },
          { label: "Quản lý kết quả", to: "/ppl/result" },
        ],
      },
    ],
  },
];

function NavRow({ item }: { item: NavItem }) {
  const location = useLocation();
  const isChildActive = item.children?.some((c) => location.pathname.startsWith(c.to));
  const [open, setOpen] = useState<boolean>(!!isChildActive);

  if (item.children) {
    const Icon = item.icon!;
    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-brand-soft hover:bg-white/10 hover:text-white transition text-sm font-medium"
        >
          <span className="flex items-center gap-2.5">
            <Icon className="h-[18px] w-[18px]" />
            {item.label}
          </span>
          {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
        {open && (
          <div className="mt-1 ml-3 pl-3 border-l border-white/15 space-y-0.5">
            {item.children.map((c) => (
              <NavLink
                key={c.to}
                to={c.to}
                className={({ isActive }) =>
                  `block px-3 py-1.5 rounded-md text-[13px] transition ${
                    isActive
                      ? "bg-white/15 text-white font-semibold border-l-[3px] border-white -ml-[1px] pl-[11px]"
                      : "text-brand-soft hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                {c.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    );
  }

  const Icon = item.icon!;
  return (
    <NavLink
      to={item.to!}
      end
      className={({ isActive }) =>
        `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
          isActive
            ? "bg-white/15 text-white border-l-[3px] border-white -ml-[1px] pl-[11px]"
            : "text-brand-soft hover:bg-white/10 hover:text-white"
        }`
      }
    >
      <Icon className="h-[18px] w-[18px]" />
      {item.label}
    </NavLink>
  );
}

export function Sidebar() {
  return (
    <aside className="w-[260px] shrink-0 sticky top-14 self-start bg-gradient-sidebar text-white" style={{ height: "calc(100vh - 56px)" }}>
      <div className="flex h-full flex-col">
        {/* User card */}
        <div className="px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white/20 border-2 border-white/30 font-bold">
              NT
            </div>
            <div className="min-w-0">
              <div className="text-[15px] font-bold truncate">{currentUser.name}</div>
              <div className="text-xs text-brand-soft truncate">{currentUser.title} · {currentUser.department}</div>
            </div>
          </div>
        </div>
        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {sections.map((sec, i) => (
            <div key={i} className={i > 0 ? "pt-3 mt-3 border-t border-white/10 space-y-0.5" : "space-y-0.5"}>
              {sec.items.map((it) => <NavRow key={it.label} item={it} />)}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
