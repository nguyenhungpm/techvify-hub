import { useState } from "react";
import { PageHeader, StatusBadge } from "@/components/portal/PortalUI";
import { usePortalStore, PortalRequest } from "@/store/portalStore";
import { X } from "lucide-react";

export default function MyApproval() {
  const approvals = usePortalStore((s) => s.approvals);
  const updateApproval = usePortalStore((s) => s.updateApproval);
  const [tab, setTab] = useState<"pending" | "done">("pending");
  const [active, setActive] = useState<PortalRequest | null>(null);
  const [comment, setComment] = useState("");

  const list = approvals.filter((a) => tab === "pending" ? a.status === "pending" : a.status !== "pending");

  return (
    <div className="max-w-[1100px]">
      <PageHeader title="My Approval" subtitle="Phê duyệt yêu cầu từ team" />
      <div className="flex border-b border-border mb-5">
        <button onClick={() => setTab("pending")} className={`px-5 py-2.5 text-sm font-semibold transition flex items-center gap-2 ${tab === "pending" ? "text-brand-bright border-b-2 border-brand-bright -mb-px" : "text-muted-foreground"}`}>
          Chờ duyệt
          <span className="status-pending px-1.5 py-0.5 rounded text-[10px] font-bold">{approvals.filter((a) => a.status === "pending").length}</span>
        </button>
        <button onClick={() => setTab("done")} className={`px-5 py-2.5 text-sm font-semibold transition ${tab === "done" ? "text-brand-bright border-b-2 border-brand-bright -mb-px" : "text-muted-foreground"}`}>Đã xử lý</button>
      </div>

      <div className="space-y-3">
        {list.length === 0 ? (
          <div className="tv-card p-8 text-center text-muted-foreground text-sm">Không có yêu cầu</div>
        ) : list.map((a) => (
          <div key={a.id} className="tv-card p-4 flex items-center justify-between gap-4 hover:shadow-elevated transition cursor-pointer" onClick={() => setActive(a)}>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm">{a.submitterName}</span>
                <span className="text-xs text-muted-foreground">· {a.submitter}</span>
                <StatusBadge status={a.status} />
              </div>
              <div className="text-[13px] mt-1">{a.typeLabel} · {a.date}</div>
              <div className="text-xs text-muted-foreground mt-0.5 truncate">{a.detail}</div>
            </div>
            <button className="text-brand-bright text-sm font-semibold hover:underline">Xem →</button>
          </div>
        ))}
      </div>

      {active && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-end" onClick={() => setActive(null)}>
          <div className="bg-card w-full max-w-md h-full overflow-y-auto animate-slide-in-right" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-brand text-white p-5 flex justify-between items-start">
              <div>
                <div className="text-xs uppercase tracking-wider text-brand-soft font-semibold">{active.typeLabel}</div>
                <div className="text-lg font-bold mt-1">{active.submitterName}</div>
                <div className="text-xs text-brand-soft">{active.submitter}</div>
              </div>
              <button onClick={() => setActive(null)} className="p-1 hover:bg-white/10 rounded"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><div className="text-xs text-muted-foreground">Ngày</div><div className="font-semibold">{active.date}</div></div>
                <div><div className="text-xs text-muted-foreground">Trạng thái</div><StatusBadge status={active.status} /></div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Chi tiết</div>
                <div className="tv-card p-3 text-[13px]">{active.detail}</div>
              </div>
              {active.status === "pending" && (
                <>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Comment (tùy chọn)</label>
                    <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3} className="tv-input mt-1.5" placeholder="Ghi chú cho người gửi..." />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { updateApproval(active.id, "approved", comment); setActive(null); setComment(""); }} className="flex-1 rounded-lg bg-success text-white px-4 py-2.5 text-sm font-bold hover:opacity-90">✓ Duyệt</button>
                    <button onClick={() => { updateApproval(active.id, "rejected", comment); setActive(null); setComment(""); }} className="flex-1 rounded-lg bg-[hsl(var(--destructive))] text-white px-4 py-2.5 text-sm font-bold hover:opacity-90">✗ Từ chối</button>
                  </div>
                </>
              )}
              {active.comment && (
                <div className="notice notice-info"><div><div className="font-bold">Comment</div><div className="text-xs mt-1">{active.comment}</div></div></div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
