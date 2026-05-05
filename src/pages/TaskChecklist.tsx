import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader, StatusBadge } from "@/components/portal/PortalUI";
import { RequestTimeline } from "@/components/portal/RequestTimeline";
import { usePortalStore, CB_ITEMS, ITS_ITEMS, ADMIN_ITEMS } from "@/store/portalStore";

interface Props { kind: "cb" | "its" | "admin"; }

const META = {
  cb: { title: "My Task — C&B", items: CB_ITEMS, doneFlag: "cbDone" as const },
  its: { title: "My Task — ITS", items: ITS_ITEMS, doneFlag: "itsDone" as const },
  admin: { title: "My Task — Admin", items: ADMIN_ITEMS, doneFlag: "adminDone" as const },
};

export default function TaskChecklist({ kind }: Props) {
  const meta = META[kind];
  const offboardings = usePortalStore((s) => s.offboardings);
  const toggle = usePortalStore((s) => s.toggleChecklist);
  const complete = usePortalStore((s) => s.completeChecklist);
  const navigate = useNavigate();
  const [tab, setTab] = useState<"open" | "done">("open");

  const filtered = offboardings.filter((o) =>
    o.managerForm && (tab === "open" ? !o[meta.doneFlag] : o[meta.doneFlag])
  );

  return (
    <div className="max-w-[1000px]">
      <PageHeader title={meta.title} subtitle={`${meta.items.length} đầu việc cho mỗi case offboarding`} />

      <div className="flex border-b border-border mb-5">
        {[["open", "Đang xử lý"], ["done", "Đã hoàn thành"]].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k as any)} className={`px-5 py-2.5 text-sm font-semibold transition ${tab === k ? "text-brand-bright border-b-2 border-brand-bright -mb-px" : "text-muted-foreground"}`}>{l}</button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="tv-card p-8 text-center text-muted-foreground text-sm">Không có task</div>
        ) : filtered.map((o) => {
          const checks = o[kind];
          const completed = checks.filter(Boolean).length;
          const allDone = completed === meta.items.length;
          const isMarkedDone = !!o[meta.doneFlag];
          const cbLocked = kind === "cb" && !(o.itsDone && o.adminDone);
          return (
            <div key={o.id} className="space-y-3">
            <RequestTimeline requestId={o.id} compact />
            <div className="tv-card overflow-hidden border-l-4 border-l-brand-bright">
              <div className="bg-secondary/40 p-4 flex justify-between items-center border-b border-border">
                <div>
                  <div className="font-bold text-sm">{o.empName} <span className="text-muted-foreground font-normal">· {o.empId}</span></div>
                  <div className="text-xs text-muted-foreground mt-0.5">{o.title} · {o.department} · LWD {o.lwd}</div>
                </div>
                <StatusBadge status={isMarkedDone ? "done" : "in_progress"} />
              </div>
              <div className="p-5">
                {kind === "cb" && (
                  cbLocked ? (
                    <div className="notice notice-warn mb-4">
                      <span>⏳</span>
                      <div>Đang chờ <b>ITS</b> và <b>Admin</b> hoàn thành bàn giao. C&B sẽ được mở sau khi cả 2 bộ phận hoàn tất.</div>
                    </div>
                  ) : !isMarkedDone && (
                    <div className="notice notice-success mb-4">
                      <span>✅</span>
                      <div>ITS và Admin đã hoàn thành. Bạn có thể bắt đầu xử lý thủ tục C&B.</div>
                    </div>
                  )
                )}
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span>Tiến độ</span>
                  <span className="text-brand-bright">{completed} / {meta.items.length} hoàn thành</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden mb-4">
                  <div className="h-full bg-brand-bright transition-all" style={{ width: `${(completed / meta.items.length) * 100}%` }} />
                </div>
                <div className={`space-y-2 ${cbLocked ? "opacity-40 pointer-events-none" : ""}`}>
                  {meta.items.map((label, i) => (
                    <label key={i} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-secondary/50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={checks[i]}
                        disabled={isMarkedDone || cbLocked}
                        onChange={() => toggle(o.id, kind, i)}
                        className="mt-0.5 h-4 w-4 accent-brand-bright"
                      />
                      <span className={`text-sm ${checks[i] ? "line-through text-success font-medium" : "text-foreground"}`}>{label}</span>
                    </label>
                  ))}
                </div>
                {!isMarkedDone && !cbLocked && (
                  <div className="mt-5 pt-4 border-t border-border flex flex-wrap items-center justify-between gap-3">
                    <button type="button" className="rounded-lg border-[1.5px] border-border bg-secondary/40 text-foreground px-3 py-2 text-[12px] font-semibold hover:border-brand-bright hover:text-brand-bright transition">
                      📎 Upload biên bản bàn giao
                    </button>
                    <button
                      disabled={!allDone}
                      onClick={() => complete(o.id, kind)}
                      className="rounded-lg bg-brand-bright text-white px-5 py-2 text-[13px] font-bold hover:bg-brand-hover disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Hoàn thành
                    </button>
                  </div>
                )}
              </div>
            </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
