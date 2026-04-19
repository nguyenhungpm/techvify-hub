import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PageHeader, StatusBadge } from "@/components/portal/PortalUI";
import { usePortalStore, RequestType } from "@/store/portalStore";
import { currentUser } from "@/lib/mockData";
import { Plus, X, TreePalm, Clock, AlertCircle, DoorOpen } from "lucide-react";

const types: { type: RequestType; label: string; icon: any; }[] = [
  { type: "leave", label: "Nghỉ phép", icon: TreePalm },
  { type: "ot", label: "Đăng ký OT", icon: Clock },
  { type: "absence", label: "Vắng mặt tính công", icon: AlertCircle },
  { type: "resignation", label: "Nghỉ việc", icon: DoorOpen },
];

export default function MyRequest() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const requests = usePortalStore((s) => s.requests);
  const addRequest = usePortalStore((s) => s.addRequest);
  const [showPicker, setShowPicker] = useState(params.get("new") === "1");
  const [activeForm, setActiveForm] = useState<RequestType | null>(null);
  const [tab, setTab] = useState<"all" | "pending" | "approved" | "rejected">("all");

  const filtered = requests.filter((r) => tab === "all" ? true : r.status === tab);

  const openType = (t: RequestType) => {
    if (t === "resignation") { navigate("/exit-form"); return; }
    setActiveForm(t);
    setShowPicker(false);
    params.delete("new"); setParams(params);
  };

  return (
    <div className="max-w-[1100px]">
      <PageHeader
        title="My Request"
        subtitle="Theo dõi yêu cầu của bạn"
        actions={
          <button onClick={() => setShowPicker(true)} className="flex items-center gap-2 rounded-lg bg-brand-bright text-white px-4 py-2.5 text-[13px] font-bold hover:bg-brand-hover transition">
            <Plus className="h-4 w-4" /> Tạo đơn mới
          </button>
        }
      />

      <div className="flex border-b border-border mb-5">
        {[["all", "Tất cả"], ["pending", "Chờ duyệt"], ["approved", "Đã duyệt"], ["rejected", "Từ chối"]].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k as any)} className={`px-5 py-2.5 text-sm font-semibold transition ${tab === k ? "text-brand-bright border-b-2 border-brand-bright -mb-px" : "text-muted-foreground hover:text-foreground"}`}>{l}</button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="tv-card p-8 text-center text-muted-foreground text-sm">Chưa có yêu cầu nào</div>
        ) : filtered.map((r) => (
          <div key={r.id} className="tv-card p-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm">{r.typeLabel}</span>
                <StatusBadge status={r.status} />
              </div>
              <div className="text-xs text-muted-foreground mt-1">Ngày: {r.date} · Tạo {new Date(r.createdAt).toLocaleDateString("vi-VN")}</div>
              <div className="text-[13px] text-foreground/80 mt-1 truncate">{r.detail}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Type picker modal */}
      {showPicker && (
        <div className="fixed inset-0 bg-black/40 z-50 grid place-items-center p-4" onClick={() => setShowPicker(false)}>
          <div className="tv-card max-w-2xl w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold">Chọn loại đơn</h2>
              <button onClick={() => setShowPicker(false)} className="p-1 hover:bg-secondary rounded"><X className="h-5 w-5" /></button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {types.map((t) => (
                <button key={t.type} onClick={() => openType(t.type)} className="tv-card p-5 hover:border-brand-bright hover:shadow-action transition flex flex-col items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-brand-light grid place-items-center text-brand-bright">
                    <t.icon className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-semibold text-center">{t.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Inline simple form */}
      {activeForm && activeForm !== "resignation" && (
        <div className="fixed inset-0 bg-black/40 z-50 grid place-items-center p-4" onClick={() => setActiveForm(null)}>
          <div className="tv-card max-w-lg w-full p-6 animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <SimpleForm
              type={activeForm}
              onSubmit={(date, detail) => {
                addRequest({
                  id: "req-" + Date.now(),
                  type: activeForm,
                  typeLabel: types.find((t) => t.type === activeForm)!.label,
                  submitter: currentUser.empId,
                  submitterName: currentUser.name,
                  date, detail, status: "pending",
                  createdAt: new Date().toISOString(),
                });
                setActiveForm(null);
              }}
              onCancel={() => setActiveForm(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function SimpleForm({ type, onSubmit, onCancel }: { type: RequestType; onSubmit: (date: string, detail: string) => void; onCancel: () => void }) {
  const [date, setDate] = useState("");
  const [detail, setDetail] = useState("");
  const label = types.find((t) => t.type === type)!.label;
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(date, detail); }}>
      <h2 className="text-lg font-bold mb-4">{label}</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Ngày <span className="req-mark">*</span></label>
          <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="tv-input" />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">Lý do / Chi tiết <span className="req-mark">*</span></label>
          <textarea required value={detail} onChange={(e) => setDetail(e.target.value)} rows={4} className="tv-input resize-none" placeholder="Mô tả ngắn gọn..." />
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-5">
        <button type="button" onClick={onCancel} className="rounded-lg border-[1.5px] border-brand-bright text-brand-bright px-4 py-2 text-[13px] font-bold hover:bg-brand-light">Huỷ</button>
        <button type="submit" className="rounded-lg bg-brand-bright text-white px-4 py-2 text-[13px] font-bold hover:bg-brand-hover">Gửi yêu cầu</button>
      </div>
    </form>
  );
}
