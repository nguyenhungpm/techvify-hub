import { Check } from "lucide-react";
import { usePortalStore, OffboardingRequest, CB_ITEMS, ITS_ITEMS, ADMIN_ITEMS } from "@/store/portalStore";

interface Props {
  requestId: string;
  compact?: boolean;
}

const STEP_LABELS = [
  "Nhân viên đã submit",
  "Manager đã xác nhận",
  "Bàn giao đang xử lý",
  "Hoàn tất bàn giao",
  "Completed",
];

export function RequestTimeline({ requestId, compact = false }: Props) {
  const off = usePortalStore((s) => s.offboardings.find((o) => o.id === requestId));
  if (!off) return null;

  const cbCount = off.cb.filter(Boolean).length;
  const itsCount = off.its.filter(Boolean).length;
  const adminCount = off.admin.filter(Boolean).length;
  const cbDone = !!off.cbDone || cbCount === CB_ITEMS.length;
  const itsDone = !!off.itsDone || itsCount === ITS_ITEMS.length;
  const adminDone = !!off.adminDone || adminCount === ADMIN_ITEMS.length;
  const pplDone = !!off.pplDone || !!(off.exitInterviewResult && off.exitInterviewResult.trim());

  const step1Done = true;
  const step2Done = !!off.managerForm;
  const step4Done = step2Done && cbDone && itsDone && adminDone && pplDone;
  const step5Done = step4Done;
  const step3Active = step2Done && !step4Done;

  const states = [
    { done: step1Done, active: false },
    { done: step2Done, active: step1Done && !step2Done },
    { done: step4Done, active: step3Active },
    { done: step4Done, active: false },
    { done: step5Done, active: false },
  ];

  const subs = [
    new Date(off.submittedAt).toLocaleDateString("vi-VN"),
    off.managerForm?.submittedAt ? new Date(off.managerForm.submittedAt).toLocaleDateString("vi-VN") : (step2Done ? "Đã xác nhận" : "Chờ xác nhận"),
    step3Active ? "Đang xử lý" : step4Done ? "Đã xong" : "—",
    step4Done ? "Đã hoàn tất" : "Chờ hoàn tất",
    step5Done ? "Hoàn thành" : "—",
  ];

  const lwdDate = off.lwd ? new Date(off.lwd) : null;
  const daysLeft = lwdDate ? Math.max(0, Math.ceil((lwdDate.getTime() - Date.now()) / 86400000)) : null;

  const depts: { icon: string; name: string; done: boolean; text: string }[] = [
    {
      icon: "📋", name: "PPL/HRBP", done: pplDone,
      text: pplDone ? `Đã đối chiếu · Exit interview: ${off.exitInterviewDate ? "đã có" : "chờ"}` : "Chờ đối chiếu form",
    },
    {
      icon: "💰", name: "C&B", done: cbDone,
      text: `${cbCount} / ${CB_ITEMS.length} tasks${daysLeft !== null ? ` · LWD còn ${daysLeft} ngày` : ""}`,
    },
    { icon: "💻", name: "ITS", done: itsDone, text: `${itsCount} / ${ITS_ITEMS.length} tasks` },
    { icon: "🏢", name: "Admin", done: adminDone, text: `${adminCount} / ${ADMIN_ITEMS.length} tasks` },
  ];

  return (
    <div className="tv-card overflow-hidden">
      <div className="bg-gradient-brand text-white p-5">
        <div className="text-[11px] uppercase tracking-wider text-brand-soft font-semibold">🚪 OFFBOARDING REQUEST</div>
        <div className="text-lg font-extrabold mt-0.5">{off.empName} · {off.empId} · {off.title} · {off.department}</div>
        <div className="text-brand-soft text-xs mt-1">
          Tạo ngày {new Date(off.submittedAt).toLocaleDateString("vi-VN")} · LWD: {off.lwd || "—"}
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start">
          {STEP_LABELS.map((label, i) => {
            const st = states[i];
            const lineDone = states[i].done && i < STEP_LABELS.length - 1;
            return (
              <div key={i} className="flex-1 flex flex-col items-center relative">
                <div className="flex items-center w-full">
                  <div className="flex-1 h-0.5" style={{ background: i === 0 ? "transparent" : (states[i - 1]?.done ? "hsl(var(--success))" : "hsl(var(--border))") }} />
                  <div className={`grid place-items-center h-9 w-9 rounded-full text-xs font-bold border-2 shrink-0 ${
                    st.done ? "bg-[hsl(var(--success))] border-[hsl(var(--success))] text-white"
                    : st.active ? "bg-[hsl(var(--blue-bright))] border-[hsl(var(--blue-bright))] text-white animate-pulse"
                    : "bg-white border-border text-muted-foreground"
                  }`}>
                    {st.done ? <Check className="h-4 w-4" /> : i + 1}
                  </div>
                  <div className="flex-1 h-0.5" style={{ background: i === STEP_LABELS.length - 1 ? "transparent" : (lineDone ? "hsl(var(--success))" : "hsl(var(--border))") }} />
                </div>
                <div className={`text-[11px] font-semibold mt-2 text-center px-1 ${st.active ? "text-[hsl(var(--blue-bright))]" : st.done ? "text-foreground" : "text-muted-foreground"}`}>{label}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5 text-center">{subs[i]}</div>
              </div>
            );
          })}
        </div>

        {!compact && step3Active && (
          <div className="mt-5 pt-5 border-t border-border">
            <div className="text-[11px] uppercase font-bold tracking-wider text-muted-foreground mb-3">CHI TIẾT BƯỚC "BÀN GIAO ĐANG XỬ LÝ"</div>
            <div className="space-y-2">
              {depts.map((d) => (
                <div key={d.name} className="flex items-center justify-between gap-3 py-2 px-3 rounded-lg bg-secondary/40">
                  <div className="flex items-center gap-3 min-w-[140px]">
                    <span className="text-base">{d.icon}</span>
                    <span className="font-bold text-sm">{d.name}</span>
                  </div>
                  <span className={`px-2 py-1 rounded text-[10px] font-bold ${d.done ? "status-done" : "status-pending"}`}>
                    {d.done ? "✅ Hoàn thành" : "⏳ In progress"}
                  </span>
                  <div className="flex-1 text-right text-xs text-muted-foreground">{d.text}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
