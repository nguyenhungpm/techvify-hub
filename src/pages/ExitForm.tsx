import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { usePortalStore, ExitFormData } from "@/store/portalStore";
import { currentUser } from "@/lib/mockData";

const PRIMARY_REASONS = [
  "💰 Lương & Đãi ngộ", "🚀 Cơ hội phát triển", "🏢 Môi trường làm việc",
  "👥 Quan hệ đồng nghiệp / quản lý", "🏠 Lý do cá nhân", "🎯 Khác",
];

const DETAIL_GROUPS: Record<string, string[]> = {
  "💰 Lương & Đãi ngộ": ["Có offer mới cao hơn", "Lương sau review chưa thỏa đáng", "Phúc lợi không cạnh tranh", "Thiếu cơ chế thưởng rõ ràng"],
  "🚀 Cơ hội phát triển": ["Thiếu lộ trình thăng tiến", "Không có dự án phù hợp", "Muốn đổi công nghệ / vai trò", "Học hỏi chậm"],
  "🏢 Môi trường làm việc": ["Áp lực công việc cao", "OT thường xuyên", "Văn hóa không phù hợp", "Quy trình rườm rà"],
  "👥 Quan hệ đồng nghiệp / quản lý": ["Mâu thuẫn với quản lý", "Mâu thuẫn với đồng nghiệp", "Thiếu hỗ trợ từ team"],
  "🏠 Lý do cá nhân": ["Lý do gia đình", "Sức khỏe", "Chuyển nơi ở", "Học tập / đi du học"],
  "🎯 Khác": ["Khởi nghiệp", "Nghỉ ngơi", "Lý do khác"],
};

const STEPS = ["Lý do", "Tương lai", "Bàn giao", "Phản hồi"];

export default function ExitForm() {
  const navigate = useNavigate();
  const upsert = usePortalStore((s) => s.upsertOffboarding);
  const offboardings = usePortalStore((s) => s.offboardings);
  const [step, setStep] = useState(0);
  const [data, setData] = useState<ExitFormData>({});
  const [done, setDone] = useState(false);
  const [openAcc, setOpenAcc] = useState<string | null>(null);

  const toggleDetail = (s: string) => {
    const cur = data.detailReasons ?? [];
    setData({ ...data, detailReasons: cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s] });
  };

  const submit = () => {
    const id = "off-" + currentUser.empId;
    const existing = offboardings.find((o) => o.id === id);
    upsert({
      id,
      empId: currentUser.empId, empName: currentUser.name, title: currentUser.title, department: currentUser.department,
      submittedAt: new Date().toISOString(),
      lwd: data.lwd ?? "",
      status: "pending_manager",
      exitForm: { ...data, submittedAt: new Date().toISOString() },
      managerForm: existing?.managerForm,
      cb: existing?.cb ?? Array(7).fill(false),
      its: existing?.its ?? Array(9).fill(false),
      admin: existing?.admin ?? Array(4).fill(false),
    });
    setDone(true);
  };

  if (done) return (
    <div className="max-w-[740px] mx-auto">
      <div className="tv-card p-10 text-center animate-fade-in">
        <div className="grid place-items-center mx-auto h-16 w-16 rounded-full bg-success text-white"><Check className="h-9 w-9" /></div>
        <h1 className="text-2xl font-extrabold mt-5">Đã gửi yêu cầu nghỉ việc</h1>
        <p className="text-muted-foreground text-sm mt-2">Quản lý của bạn đã nhận được yêu cầu và sẽ phản hồi sớm.</p>
        <div className="mt-6 space-y-2 text-left">
          {["📩 Manager nhận thông báo Manager Confirmation Form", "👥 PPL/HR nhận thông báo case mới", "📅 Lịch hẹn Exit Interview sẽ được sắp xếp"].map((s, i) => (
            <div key={i} className="tv-card p-3 text-sm flex items-center gap-2 border-l-4 border-l-brand-bright"><Check className="h-4 w-4 text-brand-bright" />{s}</div>
          ))}
        </div>
        <button onClick={() => navigate("/")} className="mt-6 rounded-lg bg-brand-bright text-white px-6 py-2.5 text-sm font-bold hover:bg-brand-hover">Về Trang chủ</button>
      </div>
    </div>
  );

  return (
    <div className="max-w-[740px] mx-auto">
      {/* Header */}
      <div className="rounded-t-2xl bg-gradient-brand text-white p-7">
        <div className="text-[11px] font-bold uppercase tracking-[0.15em] text-brand-soft">FORM 03 · EXIT EMPLOYEE</div>
        <h1 className="text-[22px] font-extrabold mt-1">Yêu cầu nghỉ việc</h1>
        <p className="text-brand-soft text-[13px] mt-1">Vui lòng cung cấp thông tin trung thực để Techvify hoàn thiện hơn.</p>
        <div className="flex gap-2 mt-3">
          <span className="bg-white/15 border border-white/30 px-2.5 py-1 rounded-md text-xs font-semibold">{currentUser.name}</span>
          <span className="bg-white/15 border border-white/30 px-2.5 py-1 rounded-md text-xs font-semibold">{currentUser.empId}</span>
        </div>
      </div>

      {/* Progress */}
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

      {/* Body */}
      <div className="bg-card border-x border-border p-7 min-h-[360px]">
        {step === 0 && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold mb-3">Lý do chính <span className="req-mark">*</span></label>
              <div className="space-y-2">
                {PRIMARY_REASONS.map((r) => (
                  <label key={r} className={`tv-radio-card ${data.primaryReason === r ? "tv-radio-card-selected" : ""}`}>
                    <input type="radio" name="primary" className="mt-0.5" checked={data.primaryReason === r} onChange={() => setData({ ...data, primaryReason: r, detailReasons: [] })} />
                    <span className="text-sm">{r}</span>
                  </label>
                ))}
              </div>
            </div>
            {data.primaryReason && (
              <div>
                <label className="block text-sm font-bold mb-2">Lý do chi tiết (chọn nhiều)</label>
                <div className="flex flex-wrap gap-2">
                  {DETAIL_GROUPS[data.primaryReason].map((s) => {
                    const sel = data.detailReasons?.includes(s);
                    return <button type="button" key={s} onClick={() => toggleDetail(s)} className={`tv-chip ${sel ? "tv-chip-selected" : ""}`}>{sel && "✓ "}{s}</button>;
                  })}
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm font-bold mb-1.5">Ghi chú thêm</label>
              <textarea value={data.notes ?? ""} onChange={(e) => setData({ ...data, notes: e.target.value })} rows={3} className="tv-input" placeholder="Mô tả thêm nếu cần..." />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold mb-3">Bạn có cân nhắc quay lại Techvify trong tương lai? <span className="req-mark">*</span></label>
              <div className="space-y-2">
                {[["yes", "✅ Có"], ["maybe", "🤔 Có thể"], ["no", "❌ Không"]].map(([v, l]) => (
                  <label key={v} className={`tv-radio-card ${data.comeback === v ? "tv-radio-card-selected" : ""}`}>
                    <input type="radio" name="comeback" checked={data.comeback === v} onChange={() => setData({ ...data, comeback: v as any })} />
                    <span className="text-sm">{l}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold mb-3">Bạn có sẵn sàng giới thiệu người quen vào Techvify? <span className="req-mark">*</span></label>
              <div className="flex gap-2">
                {[["yes", "✅ Có"], ["no", "❌ Không"]].map(([v, l]) => (
                  <button key={v} type="button" onClick={() => setData({ ...data, refer: v as any })} className={`tv-chip ${data.refer === v ? "tv-chip-selected" : ""}`}>{l}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold mb-1.5">Công việc tiếp theo (tùy chọn)</label>
              <input value={data.newJob ?? ""} onChange={(e) => setData({ ...data, newJob: e.target.value })} className="tv-input" placeholder="Vd: QA Lead tại fintech..." />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold mb-1.5">Ngày làm việc cuối (LWD) <span className="req-mark">*</span></label>
              <input type="date" value={data.lwd ?? ""} onChange={(e) => setData({ ...data, lwd: e.target.value })} className="tv-input max-w-xs" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1.5">Người tiếp nhận bàn giao</label>
              <input value={data.handoverPerson ?? ""} onChange={(e) => setData({ ...data, handoverPerson: e.target.value })} className="tv-input" placeholder="Tên đồng nghiệp..." />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1.5 flex items-center gap-2">Số ngày phép còn lại <span className="badge-autocalc">AUTO-CALC</span></label>
              <input value={data.remainingLeave ?? "5 ngày"} disabled className="tv-input bg-secondary cursor-not-allowed" />
            </div>
            <div className="notice notice-info"><span>ℹ️</span><div>Sau khi gửi, manager sẽ xác nhận LWD chính thức.</div></div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold mb-3">Mức độ hài lòng tổng thể với Techvify</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} type="button" onClick={() => setData({ ...data, satisfaction: n })} className={`h-12 w-12 rounded-lg font-bold text-lg transition ${data.satisfaction && data.satisfaction >= n ? "bg-warning text-white" : "bg-secondary text-muted-foreground"}`}>★</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold mb-1.5">Đề xuất cải thiện</label>
              <textarea value={data.improvement ?? ""} onChange={(e) => setData({ ...data, improvement: e.target.value })} rows={4} className="tv-input" placeholder="Chia sẻ giúp Techvify tốt hơn..." />
            </div>
            <div>
              <button type="button" onClick={() => setOpenAcc(openAcc === "rev" ? null : "rev")} className="w-full flex justify-between items-center tv-card p-3.5">
                <span className="font-semibold text-sm">Xem lại toàn bộ thông tin</span>
                <ChevronDown className={`h-4 w-4 transition ${openAcc === "rev" ? "rotate-180" : ""}`} />
              </button>
              {openAcc === "rev" && (
                <div className="tv-card p-4 mt-2 text-xs space-y-1.5">
                  <div><b>Lý do chính:</b> {data.primaryReason ?? "—"}</div>
                  <div><b>Chi tiết:</b> {data.detailReasons?.join(", ") || "—"}</div>
                  <div><b>Quay lại:</b> {data.comeback ?? "—"}</div>
                  <div><b>Giới thiệu:</b> {data.refer ?? "—"}</div>
                  <div><b>LWD:</b> {data.lwd ?? "—"}</div>
                  <div><b>Bàn giao:</b> {data.handoverPerson ?? "—"}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <div className="rounded-b-2xl bg-card border border-border border-t-0 px-7 py-4 flex justify-between">
        <button onClick={() => step === 0 ? navigate(-1) : setStep(step - 1)} className="flex items-center gap-1 rounded-lg border-[1.5px] border-brand-bright text-brand-bright px-4 py-2 text-[13px] font-bold hover:bg-brand-light">
          <ChevronLeft className="h-4 w-4" /> {step === 0 ? "Huỷ" : "Quay lại"}
        </button>
        {step < STEPS.length - 1 ? (
          <button onClick={() => setStep(step + 1)} className="flex items-center gap-1 rounded-lg bg-brand-bright text-white px-5 py-2 text-[13px] font-bold hover:bg-brand-hover">
            Tiếp tục <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <button onClick={submit} className="rounded-lg bg-brand-bright text-white px-6 py-2 text-[13px] font-bold hover:bg-brand-hover">Gửi yêu cầu nghỉ việc</button>
        )}
      </div>
    </div>
  );
}
