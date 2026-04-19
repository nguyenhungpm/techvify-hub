import { useState } from "react";
import { PageHeader } from "@/components/portal/PortalUI";
import { myTimesheet } from "@/lib/mockData";

export default function MyAttendance() {
  const [tab, setTab] = useState<"today" | "week" | "month">("today");
  const today = myTimesheet[0];
  return (
    <div className="max-w-[1100px]">
      <PageHeader title="My Attendance" subtitle="Chấm công cá nhân tuần 14–18/04/2026" />
      <div className="flex border-b border-border mb-5">
        {[["today", "Hôm nay"], ["week", "Tuần"], ["month", "Tháng"]].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k as any)} className={`px-5 py-2.5 text-sm font-semibold transition ${tab === k ? "text-brand-bright border-b-2 border-brand-bright -mb-px" : "text-muted-foreground hover:text-foreground"}`}>{l}</button>
        ))}
      </div>

      {tab === "today" && (
        <div className="space-y-4">
          <div className="bg-gradient-brand text-white rounded-xl p-5 flex items-center justify-between">
            <div>
              <div className="text-brand-soft text-xs font-semibold uppercase tracking-wider">Ca làm hôm nay</div>
              <div className="text-2xl font-extrabold mt-1">HC_1C · 08:30 → 17:30</div>
              <div className="text-brand-soft text-sm mt-1">{today.day}</div>
            </div>
            <div className="text-right">
              <div className="text-brand-soft text-xs">Tổng giờ</div>
              <div className="text-3xl font-extrabold">{today.total}</div>
            </div>
          </div>
          <div className="tv-card p-5">
            <h3 className="font-bold text-sm mb-3">Time logs</h3>
            <div className="text-sm space-y-2">
              {today.inOut.split(" · ").map((s, i) => (
                <div key={i} className="flex justify-between border-b border-border pb-2 last:border-0">
                  <span className="text-muted-foreground">Lần {i + 1}</span>
                  <span className="font-medium">{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "week" && (
        <div className="grid grid-cols-5 gap-3">
          {myTimesheet.map((d, i) => (
            <div key={i} className={`tv-card p-4 ${d.status === "Thiếu công" ? "border-l-4 border-l-[hsl(var(--destructive))]" : ""}`}>
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{d.day}</div>
              <div className="text-sm font-semibold mt-1">{d.shift}</div>
              <div className="text-xs text-muted-foreground mt-2 truncate" title={d.inOut}>{d.inOut}</div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-lg font-extrabold">{d.total}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${d.status === "Đủ công" ? "status-done" : "status-rejected"}`}>{d.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "month" && (
        <div className="tv-card p-5">
          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: 30 }, (_, i) => {
              const lvl = (i % 7 === 5 || i % 7 === 6) ? 0 : (i === 17 ? 2 : 1);
              const colors = ["bg-secondary", "bg-success/40", "bg-[hsl(var(--destructive))]/40"];
              return <div key={i} className={`aspect-square rounded grid place-items-center text-xs font-semibold ${colors[lvl]}`}>{i + 1}</div>;
            })}
          </div>
          <div className="flex items-center gap-4 mt-4 text-xs">
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-success/40 rounded"></span> Đủ công</div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-[hsl(var(--destructive))]/40 rounded"></span> Thiếu công</div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-secondary rounded"></span> Cuối tuần</div>
          </div>
        </div>
      )}
    </div>
  );
}
