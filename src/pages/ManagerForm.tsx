import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Check, ChevronLeft, ChevronRight, Lock, FileText } from "lucide-react";
import { usePortalStore, ManagerFormData } from "@/store/portalStore";

const STEPS = ["Phân loại", "Đánh giá", "Bàn giao tri thức"];
const REASONS = ["💰 Lương & Đãi ngộ", "🚀 Cơ hội phát triển", "🏢 Môi trường", "👥 Quan hệ", "🏠 Cá nhân", "🎯 Khác"];
const KT_OPTIONS = ["Source code & repo", "Tài liệu kỹ thuật", "Quan hệ khách hàng", "Quy trình nội bộ", "Tài khoản hệ thống"];

export default function ManagerForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const off = usePortalStore((s) => s.offboardings.find((o) => o.id === id));
  const updateOffboarding = usePortalStore((s) => s.updateOffboarding);
  const [showForm, setShowForm] = useState(false);
  const [step, setStep] = useState(0);
  const [data, setData] = useState<ManagerFormData>({});
  const [done, setDone] = useState(false);
  const [triggers, setTriggers] = useState<string[]>([]);

  if (!off) return <div className="p-8">Không tìm thấy yêu cầu</div>;

  const toggleKT = (k: string) => {
    const cur = data.knowledgeTransfer ?? [];
    setData({ ...data, knowledgeTransfer: cur.includes(k) ? cur.filter((x) => x !== k) : [...cur, k] });
  };

  const submit = () => {
    updateOffboarding(off.id, { managerForm: { ...data, submittedAt: new Date().toISOString() }, status: "in_progress" });
    setDone(true);
    const all = ["✅ C&B nhận task xử lý lương & BHXH", "✅ ITS nhận task thu hồi thiết bị", "✅ Admin nhận task bàn giao hành chính", "✅ PPL/HR có thể đối chiếu 2 form", "📅 Exit Interview được lên lịch"];
    all.forEach((t, i) => setTimeout(() => setTriggers((p) => [...p, t]), 300 * (i + 1)));
  };

  if (done) return (
    <div className="max-w-[740px] mx-auto">
      <div className="tv-card p-10 text-center">
        <div className="grid place-items-center mx-auto h-16 w-16 rounded-full bg-success text-white animate-fade-in"><Check className="h-9 w-9" /></div>
        <h1 className="text-2xl font-extrabold mt-5">Đã gửi Manager Confirmation</h1>
        <p className="text-muted-foreground text-sm mt-2">Hệ thống đã trigger các bộ phận tiếp theo:</p>
        <div className="mt-6 space-y-2 text-left">
          {triggers.map((t, i) => (
            <div key={i} className="tv-card p-3 text-sm flex items-center gap-2 border-l-4 border-l-brand-bright animate-fade-in">{t}</div>
          ))}
        </div>
        <button onClick={() => navigate("/")} className="mt-6 rounded-lg bg-brand-bright text-white px-6 py-2.5 text-sm font-bold hover:bg-brand-hover">Về Trang chủ</button>
      </div>
    </div>
  );

  if (!showForm) return (
    <div className="max-w-[740px] mx-auto">
      <div className="tv-card overflow-hidden border-l-4 border-l-[hsl(var(--destructive))]">
        <div className="bg-gradient-brand text-white p-6">
          <div className="text-xs uppercase tracking-wider text-brand-soft font-semibold">REQUEST · OFFBOARDING</div>
          <h1 className="text-2xl font-extrabold mt-1">{off.empName}</h1>
          <div className="text-brand-soft text-sm">{off.empId} · {off.title} · {off.department}</div>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><div className="text-xs text-muted-foreground">Ngày gửi</div><div className="font-semibold">{new Date(off.submittedAt).toLocaleDateString("vi-VN")}</div></div>
            <div><div className="text-xs text-muted-foreground">LWD đề xuất</div><div className="font-semibold">{off.lwd}</div></div>
            <div><div className="text-xs text-muted-foreground">Trạng thái</div><div className="font-semibold">Chờ Manager xác nhận</div></div>
            <div><div className="text-xs text-muted-foreground">SLA</div><div className="font-bold text-[hsl(var(--destructive))]">QUÁ HẠN</div></div>
          </div>
          <div className="notice notice-confidential">
            <Lock className="h-5 w-5 shrink-0" />
            <div>
              <div className="font-bold">Thông tin Exit Form được bảo mật</div>
              <div className="text-xs mt-1">Bạn KHÔNG được xem nội dung Employee Exit Form. Chỉ PPL/HR có quyền đối chiếu sau khi cả 2 bên gửi form.</div>
            </div>
          </div>
          <div className="tv-card p-4 flex justify-between items-center">
            <div>
              <div className="font-semibold text-sm">Manager Confirmation Form</div>
              <div className="text-xs text-muted-foreground mt-0.5">Chưa gửi · Cần hoàn thành để mở khoá flow</div>
            </div>
            <button onClick={() => setShowForm(true)} className="rounded-lg bg-brand-bright text-white px-4 py-2 text-[13px] font-bold hover:bg-brand-hover flex items-center gap-2"><FileText className="h-4 w-4" /> Mở form</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-[740px] mx-auto">
      <div className="rounded-t-2xl bg-gradient-brand text-white p-7">
        <div className="text-[11px] font-bold uppercase tracking-[0.15em] text-brand-soft">FORM 01 · MANAGER CONFIRMATION</div>
        <h1 className="text-[22px] font-extrabold mt-1">Xác nhận của Manager</h1>
        <p className="text-brand-soft text-[13px] mt-1">Đánh giá khách quan giúp PPL/HR xử lý case hiệu quả.</p>
      </div>

      <div className="bg-card border-x border-border px-7 py-4">
        <div className="flex items-center">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center flex-1 last:flex-none">
              <div className="flex items-center gap-2.5">
                <div className={`grid place-items-center h-8 w-8 rounded-full text-xs font-bold ${i < step ? "bg-success text-white" : i === step ? "bg-brand-bright text-white" : "bg-white border-2 border-border text-muted-foreground"}`}>
                  {i < step ? <Check className="h-4 w-4" /> : i + 1}
                </div>
                <span className={`text-xs font-semibold ${i === step ? "text-foreground" : "text-muted-foreground"}`}>{s}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-3 ${i < step ? "bg-success" : "bg-border"}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border-x border-border p-7 min-h-[340px]">
        {step === 0 && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold mb-3">Phân loại lý do nghỉ <span className="req-mark">*</span></label>
              <div className="flex flex-wrap gap-2">
                {REASONS.map((r) => (
                  <button type="button" key={r} onClick={() => setData({ ...data, reasonClassification: r })} className={`tv-chip ${data.reasonClassification === r ? "tv-chip-selected" : ""}`}>{r}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold mb-3">Loại nghỉ <span className="req-mark">*</span></label>
              <div className="grid grid-cols-2 gap-2">
                {[["VOL", "VOL — Voluntary (tự nguyện)"], ["INVOL", "INVOL — Involuntary (bị động)"]].map(([v, l]) => (
                  <label key={v} className={`tv-radio-card ${data.exitType === v ? "tv-radio-card-selected" : ""}`}>
                    <input type="radio" checked={data.exitType === v} onChange={() => setData({ ...data, exitType: v as any })} />
                    <span className="text-sm">{l}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold mb-1.5">Diễn giải <span className="req-mark">*</span></label>
              <textarea value={data.narrative ?? ""} onChange={(e) => setData({ ...data, narrative: e.target.value })} rows={3} className="tv-input" placeholder='Vd: "Nhận offer cao hơn ~30%..."' />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold mb-3">Mức độ critical với dự án</label>
              <div className="space-y-2">
                {[["low", "🟢 Thấp"], ["normal", "🟡 Bình thường"], ["high", "🔴 Cao"]].map(([v, l]) => (
                  <label key={v} className={`tv-radio-card ${data.criticality === v ? "tv-radio-card-selected" : ""}`}>
                    <input type="radio" checked={data.criticality === v} onChange={() => setData({ ...data, criticality: v as any })} />
                    <span className="text-sm">{l}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold mb-3">Cần Replacement?</label>
              <div className="flex gap-2">
                {[["yes", "✅ Có"], ["no", "❌ Không"]].map(([v, l]) => (
                  <button key={v} type="button" onClick={() => setData({ ...data, needReplacement: v as any })} className={`tv-chip ${data.needReplacement === v ? "tv-chip-selected" : ""}`}>{l}</button>
                ))}
              </div>
            </div>
            {data.needReplacement === "yes" && (
              <div>
                <label className="block text-sm font-bold mb-1.5">Cần có thay thế trước</label>
                <input type="date" value={data.replacementBy ?? ""} onChange={(e) => setData({ ...data, replacementBy: e.target.value })} className="tv-input max-w-xs" />
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold mb-3">Tri thức cần bàn giao</label>
              <div className="flex flex-wrap gap-2">
                {KT_OPTIONS.map((k) => {
                  const sel = data.knowledgeTransfer?.includes(k);
                  return <button key={k} type="button" onClick={() => toggleKT(k)} className={`tv-chip ${sel ? "tv-chip-selected" : ""}`}>{sel && "✓ "}{k}</button>;
                })}
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold mb-1.5">Rủi ro & ghi chú</label>
              <textarea value={data.riskNotes ?? ""} onChange={(e) => setData({ ...data, riskNotes: e.target.value })} rows={4} className="tv-input" placeholder="Lưu ý về dự án, khách hàng..." />
            </div>
          </div>
        )}
      </div>

      <div className="rounded-b-2xl bg-card border border-border border-t-0 px-7 py-4 flex justify-between">
        <button onClick={() => step === 0 ? setShowForm(false) : setStep(step - 1)} className="flex items-center gap-1 rounded-lg border-[1.5px] border-brand-bright text-brand-bright px-4 py-2 text-[13px] font-bold hover:bg-brand-light">
          <ChevronLeft className="h-4 w-4" /> Quay lại
        </button>
        {step < STEPS.length - 1 ? (
          <button onClick={() => setStep(step + 1)} className="flex items-center gap-1 rounded-lg bg-brand-bright text-white px-5 py-2 text-[13px] font-bold hover:bg-brand-hover">Tiếp tục <ChevronRight className="h-4 w-4" /></button>
        ) : (
          <button onClick={submit} className="rounded-lg bg-brand-bright text-white px-6 py-2 text-[13px] font-bold hover:bg-brand-hover">Gửi xác nhận</button>
        )}
      </div>
    </div>
  );
}
