import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PageHeader, StatusBadge } from "@/components/portal/PortalUI";
import { RequestTimeline } from "@/components/portal/RequestTimeline";
import { usePortalStore, RequestType } from "@/store/portalStore";
import { currentUser } from "@/lib/mockData";
import { Plus, X, TreePalm, Clock, AlertCircle, DoorOpen, ChevronLeft } from "lucide-react";

const types: { type: RequestType; label: string; icon: any }[] = [
  { type: "leave", label: "Nghỉ phép", icon: TreePalm },
  { type: "ot", label: "Đăng ký OT", icon: Clock },
  { type: "absence", label: "Vắng mặt tính công", icon: AlertCircle },
  { type: "resignation", label: "Nghỉ việc", icon: DoorOpen },
];

const CATEGORIES = [
  "💼 Vị trí & Vai trò", "📁 Dự án & Quy trình", "👤 Quản lý & Dẫn dắt đội ngũ",
  "💰 Lương & Đãi ngộ", "🚀 Thăng tiến & Phát triển", "🏢 Văn hóa & Năng lực",
  "🌱 Chủ quan & Khách quan", "📌 Khác",
];

type Row = {
  id: string; kind: "request" | "offboarding";
  type: string; typeLabel: string; date: string; detail: string;
  status: string; createdAt: string;
  offId?: string;
};

export default function MyRequest() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const requests = usePortalStore((s) => s.requests);
  const offboardings = usePortalStore((s) => s.offboardings);
  const addRequest = usePortalStore((s) => s.addRequest);
  const [showPicker, setShowPicker] = useState(params.get("new") === "1");
  const [activeForm, setActiveForm] = useState<RequestType | null>(null);
  const [tab, setTab] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [openDetail, setOpenDetail] = useState<string | null>(null);

  const rows: Row[] = useMemo(() => {
    const own = offboardings.filter((o) => o.empId === currentUser.empId).map<Row>((o) => ({
      id: "off:" + o.id, kind: "offboarding", offId: o.id,
      type: "resignation", typeLabel: "🚪 Nghỉ việc",
      date: o.lwd, detail: `LWD: ${o.lwd}`,
      status: o.status === "completed" ? "approved" : "pending_manager",
      createdAt: o.submittedAt,
    }));
    const reqs = requests.map<Row>((r) => ({
      id: "req:" + r.id, kind: "request",
      type: r.type, typeLabel: r.typeLabel, date: r.date, detail: r.detail,
      status: r.status, createdAt: r.createdAt,
    }));
    return [...own, ...reqs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [requests, offboardings]);

  const filtered = rows.filter((r) => {
    if (tab === "all") return true;
    if (tab === "pending") return r.status === "pending" || r.status === "pending_manager";
    return r.status === tab;
  });

  const openType = (t: RequestType) => {
    if (t === "resignation") { navigate("/exit-form"); return; }
    setActiveForm(t);
    setShowPicker(false);
    params.delete("new"); setParams(params);
  };

  const detailOff = openDetail ? offboardings.find((o) => o.id === openDetail) : null;

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
          <div
            key={r.id}
            onClick={() => r.kind === "offboarding" && r.offId && setOpenDetail(r.offId)}
            className={`tv-card p-4 flex items-center justify-between gap-4 ${r.kind === "offboarding" ? "cursor-pointer hover:border-brand-bright transition" : ""}`}
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-sm">{r.typeLabel}</span>
                <StatusBadge status={r.status} />
              </div>
              <div className="text-xs text-muted-foreground mt-1">Ngày: {r.date} · Tạo {new Date(r.createdAt).toLocaleDateString("vi-VN")}</div>
              <div className="text-[13px] text-foreground/80 mt-1 truncate">{r.detail}</div>
            </div>
            {r.kind === "offboarding" && <span className="text-brand-bright text-xs font-semibold shrink-0">Xem chi tiết ›</span>}
          </div>
        ))}
      </div>

      {/* Detail view for offboarding */}
      {detailOff && (
        <div className="fixed inset-0 bg-black/40 z-50 overflow-auto p-6" onClick={() => setOpenDetail(null)}>
          <div className="max-w-[900px] mx-auto space-y-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <button onClick={() => setOpenDetail(null)} className="flex items-center gap-1 text-white text-sm font-semibold">
                <ChevronLeft className="h-4 w-4" /> Đóng
              </button>
              <button onClick={() => setOpenDetail(null)} className="bg-white/20 rounded-md p-1.5"><X className="h-4 w-4 text-white" /></button>
            </div>
            <RequestTimeline requestId={detailOff.id} />
            <div className="tv-card p-6 space-y-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">CHI TIẾT EXIT FORM CỦA BẠN</div>
              {detailOff.exitForm ? (
                <div className="text-sm space-y-3">
                  <Row label="LWD"><span>{detailOff.exitForm.lwd ?? "—"}</span></Row>
                  <Row label="Lý do nghỉ (chi tiết)">
                    <ul className="list-disc list-inside text-foreground/80">
                      {Object.entries(detailOff.exitForm.reasonsByCategory ?? {}).map(([cat, chips]) =>
                        chips.length ? <li key={cat}><b>{cat}:</b> {chips.join(", ")}</li> : null
                      )}
                      {detailOff.exitForm.otherReason && <li><b>📌 Khác:</b> {detailOff.exitForm.otherReason}</li>}
                    </ul>
                  </Row>
                  <Row label="Danh mục quan trọng nhất"><span>{detailOff.exitForm.primaryCategory ?? "—"}</span></Row>
                  <Row label="Hài lòng / ấn tượng"><span className="text-foreground/80">{detailOff.exitForm.satisfactionText || "—"}</span></Row>
                  <Row label="Chính sách cản trở"><span className="text-foreground/80">{detailOff.exitForm.policyBlocker || "—"}</span></Row>
                  <Row label="Thu hút ở công việc tiếp theo"><span className="text-foreground/80">{detailOff.exitForm.nextJobAttraction || "—"}</span></Row>
                  <Row label="Đề xuất cải thiện"><span className="text-foreground/80">{detailOff.exitForm.improvementSuggestion || "—"}</span></Row>
                  <Row label="Quay lại Techvify?">
                    <span>{detailOff.exitForm.comebackChoice === "yes" ? "✅ Sẵn sàng quay lại" : detailOff.exitForm.comebackChoice === "maybe" ? "🤔 Có thể" : detailOff.exitForm.comebackChoice === "never" ? "❌ Không bao giờ" : "—"}</span>
                  </Row>
                  <Row label="Giới thiệu người quen?">
                    <span>{detailOff.exitForm.referChoice ?? "—"}</span>
                  </Row>
                </div>
              ) : <div className="text-muted-foreground text-sm">Không có dữ liệu form.</div>}
            </div>
          </div>
        </div>
      )}

      {/* Type picker */}
      {showPicker && (
        <div className="fixed inset-0 bg-black/40 z-50 grid place-items-center p-4" onClick={() => setShowPicker(false)}>
          <div className="tv-card max-w-2xl w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold">Chọn loại đơn</h2>
              <button onClick={() => setShowPicker(false)} className="p-1 hover:bg-secondary rounded"><X className="h-5 w-5" /></button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {types.map((t) => (
                <button key={t.type} onClick={() => openType(t.type)} className="tv-card p-5 hover:border-brand-bright transition flex flex-col items-center gap-3">
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

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[180px_1fr] gap-3 items-start">
      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="text-sm">{children}</div>
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
