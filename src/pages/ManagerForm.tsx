import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Check, ChevronLeft, ChevronRight, Lock, FileText } from "lucide-react";
import { usePortalStore, ManagerFormData } from "@/store/portalStore";
import { StatusBadge } from "@/components/portal/PortalUI";
import { teamD2 } from "@/lib/mockData";

const STEP_LABELS = ["Thông tin nhân sự", "Phân loại nghỉ", "Impact dự án", "Xác nhận"];
const LEVELS = [
  "Intern", "Fresher (L1)", "Junior (L2)", "Middle (L3)", "Senior (L4)",
  "Lead / Tech Lead (L5)", "Principal / Architect (L6)", "Manager", "Senior Manager / Director",
];
const CATEGORIES = [
  "💼 Vị trí & Vai trò", "📁 Dự án & Quy trình", "👤 Quản lý & Dẫn dắt đội ngũ",
  "💰 Lương & Đãi ngộ", "🚀 Thăng tiến & Phát triển", "🏢 Văn hóa & Năng lực",
  "🌱 Chủ quan & Khách quan", "📌 Khác",
];

const MANAGER = { name: "Nguyễn Minh Huy", title: "Delivery Manager", dept: "Delivery Unit D2" };

function calcSeniority(joinDate: string, lwd: string) {
  if (!joinDate || !lwd) return "—";
  const a = new Date(joinDate); const b = new Date(lwd);
  let m = (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth());
  if (b.getDate() < a.getDate()) m--;
  if (m < 0) m = 0;
  return `${Math.floor(m / 12)} năm ${m % 12} tháng`;
}

export default function ManagerForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const offboardings = usePortalStore((s) => s.offboardings);
  const off = offboardings.find((o) => o.id === id);
  const update = usePortalStore((s) => s.updateOffboarding);

  const [showForm, setShowForm] = useState(false);
  const [step, setStep] = useState(0);
  const [data, setData] = useState<ManagerFormData>({
    managerName: MANAGER.name, managerTitle: MANAGER.title, managerDept: MANAGER.dept,
    selectedEmpId: off?.empId, lwd: off?.lwd, noticeDate: new Date().toISOString().slice(0, 10),
  });
  const [done, setDone] = useState(false);
  const [triggers, setTriggers] = useState<string[]>([]);

  const pendingList = offboardings.filter((o) => o.status === "pending_manager" && !o.managerForm);
  const empInfo = useMemo(() => teamD2.find((t) => t.empId === data.selectedEmpId)
    ?? (off ? { empId: off.empId, name: off.empName, title: off.title, joinDate: "2023-01-10", contract: "Chính thức", des: "GlobalBank — QA Automation Suite", billable: 80 } as any : null), [data.selectedEmpId, off]);

  if (!off) return <div className="p-8">Không tìm thấy yêu cầu</div>;

  const canNext =
    step === 0 ? !!data.selectedEmpId && !!data.empLevel && !!data.noticeDate && !!data.lwd
    : step === 1 ? !!data.exitType && !!data.reasonClassification && !!(data.narrative && data.narrative.trim())
    : step === 2 ? !!data.critical && !!data.replacement
    : step === 3 ? !!data.confirmed
    : true;

  const submit = () => {
    update(off.id, {
      managerForm: { ...data, submittedAt: new Date().toISOString() },
      status: "in_progress",
    });
    setDone(true);
    const all = [
      "🖥 THRM — Working Status → Pending Exit",
      "📧 C&B — Nhận notification để xử lý thủ tục",
      "📋 HRBP — Task tạo Exit Interview được assign",
      "💻 ITS — Equipment plan được trigger",
      "🏢 Admin — Bàn giao hành chính được trigger",
    ];
    all.forEach((t, i) => setTimeout(() => setTriggers((p) => [...p, t]), 300 * (i + 1)));
  };

  if (done) return (
    <div className="max-w-[740px] mx-auto">
      <div className="tv-card p-10 text-center">
        <div className="text-5xl">✅</div>
        <h1 className="text-[22px] font-extrabold mt-4">Đã submit thành công</h1>
        <p className="text-muted-foreground text-sm mt-2">Thông tin đã được ghi nhận. Hệ thống đang xử lý các bước tiếp theo tự động.</p>
        <div className="mt-6 space-y-2 text-left max-w-md mx-auto">
          {triggers.map((t, i) => (
            <div key={i} className="rounded-md text-[13px] px-3 py-2 animate-fade-in" style={{ background: "hsl(142 76% 96%)", border: "1px solid hsl(141 79% 85%)", color: "hsl(142 71% 30%)" }}>{t}</div>
          ))}
        </div>
        <button onClick={() => navigate(-1)} className="mt-7 rounded-lg bg-brand-bright text-white px-6 py-2.5 text-sm font-bold hover:bg-brand-hover">← Quay lại</button>
      </div>
    </div>
  );

  if (!showForm) return (
    <div className="max-w-[740px] mx-auto">
      <div className="tv-card overflow-hidden border-l-4 border-l-[hsl(var(--destructive))]">
        <div className="bg-gradient-brand text-white p-6">
          <div className="text-2xl font-extrabold">{off.empName}</div>
          <div className="text-brand-soft text-sm mt-0.5">{off.empId} · {off.title} · Delivery Unit {off.department}</div>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">THÔNG TIN NHÂN SỰ (từ THRM)</div>
            <div className="text-sm space-y-0.5">
              <div>{off.empName} · {off.empId}</div>
              <div className="text-muted-foreground">{off.title} · Delivery Unit {off.department}</div>
              <div className="text-muted-foreground">Loại HĐ: Chính thức · Join: 10/01/2023</div>
            </div>
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">THÔNG TIN ĐƠN</div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><div className="text-xs text-muted-foreground">Ngày NV gửi đơn</div><div className="font-semibold">{new Date(off.submittedAt).toLocaleDateString("vi-VN")}</div></div>
              <div><div className="text-xs text-muted-foreground">LWD theo đơn NV</div><div className="font-semibold">{off.lwd}</div></div>
              <div className="col-span-2"><StatusBadge status="pending_manager" /></div>
            </div>
          </div>
          <div className="notice notice-confidential">
            <Lock className="h-5 w-5 shrink-0" />
            <div>
              <div className="font-bold">BẢO MẬT</div>
              <div className="text-xs mt-1">Nội dung phản hồi và lý do nghỉ trong đơn của nhân viên được bảo mật tuyệt đối — chỉ bộ phận PPL/HRBP được xem. Manager vui lòng điền đánh giá độc lập bên dưới.</div>
            </div>
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">TRẠNG THÁI MANAGER FORM</div>
            <div className="text-sm text-muted-foreground mb-3">○ Chưa điền</div>
            <button onClick={() => setShowForm(true)} className="w-full rounded-lg bg-brand-bright text-white px-4 py-2.5 text-[13px] font-bold hover:bg-brand-hover flex items-center justify-center gap-2">
              <FileText className="h-4 w-4" /> Điền Manager Form →
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const seniority = empInfo ? calcSeniority(empInfo.joinDate, data.lwd ?? off.lwd) : "—";

  return (
    <div className="max-w-[740px] mx-auto">
      <div className="rounded-t-2xl bg-gradient-brand text-white p-7">
        <div className="text-[11px] font-bold uppercase tracking-[0.15em] text-brand-soft">FORM 01 · DIRECT MANAGER · STEP {step + 1}</div>
        <h1 className="text-[22px] font-extrabold mt-1">Manager Resignation Confirmation</h1>
        <p className="text-brand-soft text-[13px] mt-1">Vui lòng cung cấp thông tin chính xác về nhân sự nghỉ việc để đảm bảo quy trình offboarding và dữ liệu Turnover Report được xử lý đúng.</p>
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="bg-white/15 border border-white/30 px-2.5 py-1 rounded-md text-xs font-semibold">🖥 DES / THRM</span>
          <span className="bg-white/15 border border-white/30 px-2.5 py-1 rounded-md text-xs font-semibold">👤 Direct Manager</span>
          <span className="bg-white/15 border border-white/30 px-2.5 py-1 rounded-md text-xs font-semibold">⏱ SLA: 1 ngày</span>
        </div>
      </div>

      <div className="bg-card border-x border-border px-7 py-3.5">
        <div className="flex items-center">
          {STEP_LABELS.map((s, i) => (
            <div key={s} className="flex items-center flex-1 last:flex-none">
              <div className="flex items-center gap-2.5">
                <div className={`grid place-items-center h-8 w-8 rounded-full text-xs font-bold ${i < step ? "bg-success text-white" : i === step ? "bg-brand-bright text-white" : "bg-white border-2 border-border text-muted-foreground"}`}>
                  {i < step ? <Check className="h-4 w-4" /> : i + 1}
                </div>
                <span className={`text-xs font-semibold ${i === step ? "text-foreground" : "text-muted-foreground"}`}>{s}</span>
              </div>
              {i < STEP_LABELS.length - 1 && <div className={`flex-1 h-0.5 mx-3 ${i < step ? "bg-success" : "bg-border"}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border-x border-border p-7 min-h-[380px] space-y-5">
        {step === 0 && (
          <>
            <SubHeader>Thông tin quản lý</SubHeader>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Họ và tên" autofill><input readOnly value={data.managerName} className="tv-input bg-secondary" /></Field>
              <Field label="Chức danh" autofill><input readOnly value={data.managerTitle} className="tv-input bg-secondary" /></Field>
              <Field label="Bộ phận / Ban" autofill><input readOnly value={data.managerDept} className="tv-input bg-secondary" /></Field>
            </div>

            <div className="border-t border-border" />

            <SubHeader>Thông tin nhân sự</SubHeader>
            <div className="notice notice-info">
              <span>ℹ️</span>
              <div>Chọn tên nhân sự đã submit Exit Form từ danh sách bên dưới. Các thông tin còn lại sẽ được tự động điền từ hệ thống THRM.</div>
            </div>

            <Field label="Chọn nhân sự nghỉ việc" required>
              <select value={data.selectedEmpId ?? ""} onChange={(e) => setData({ ...data, selectedEmpId: e.target.value })} className="tv-input">
                <option value="">— Chọn nhân sự đã submit Exit Form —</option>
                {pendingList.map((p) => (
                  <option key={p.id} value={p.empId}>{p.empId} · {p.empName} · {p.title} · {p.department}</option>
                ))}
                {!pendingList.find((p) => p.empId === off.empId) && (
                  <option value={off.empId}>{off.empId} · {off.empName} · {off.title} · {off.department}</option>
                )}
              </select>
              <div className="text-[11px] text-muted-foreground mt-1.5">Chỉ hiển thị nhân sự đã submit Employee Exit Form và chưa được Manager confirm</div>
            </Field>

            {data.selectedEmpId && empInfo && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Mã nhân viên"><input readOnly value={empInfo.empId} className="tv-input bg-secondary" /></Field>
                  <Field label="Họ và tên"><input readOnly value={empInfo.name} className="tv-input bg-secondary" /></Field>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Chức danh / Position"><input readOnly value={empInfo.title} className="tv-input bg-secondary" /></Field>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                      Level <span className="badge-missing ml-1">THIẾU — cần bổ sung</span>
                    </label>
                    <select value={data.empLevel ?? ""} onChange={(e) => setData({ ...data, empLevel: e.target.value })} className="tv-input">
                      <option value="">— Xác nhận Level —</option>
                      {LEVELS.map((l) => <option key={l}>{l}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Delivery Unit"><input readOnly value={off.department === "D2" ? "D3" : off.department} className="tv-input bg-secondary" /></Field>
                  <Field label="Loại hợp đồng"><input readOnly value={(empInfo as any).contract ?? "Chính thức"} className="tv-input bg-secondary" /></Field>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <Field label="Ngày thông báo" required>
                    <input type="date" value={data.noticeDate ?? ""} onChange={(e) => setData({ ...data, noticeDate: e.target.value })} className="tv-input" />
                  </Field>
                  <Field label="Last Working Day" required>
                    <input type="date" value={data.lwd ?? ""} onChange={(e) => setData({ ...data, lwd: e.target.value })} className="tv-input" />
                  </Field>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                      Thâm niên (tự động) <span className="badge-autocalc ml-1">AUTO-CALC</span>
                    </label>
                    <input readOnly value={seniority} className="tv-input bg-secondary" />
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {step === 1 && (
          <>
            <SectionTitle>B  Phân loại nghỉ việc</SectionTitle>
            <div className="notice notice-warn">
              <span>⚠️</span>
              <div>Vui lòng điền chính xác <b>Loại nghỉ việc</b> và <b>Lý do nhân sự nghỉ việc</b>, bao gồm Diễn giải chi tiết.</div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-3">
                Loại nghỉ việc <span className="req-mark">*</span> <span className="badge-missing ml-1">THIẾU</span>
              </label>
              <div className="space-y-2">
                {[
                  ["VOL", "VOL — Voluntary", "(Nhân sự tự nguyện nghỉ)"],
                  ["INVOL", "INVOL — Involuntary", "(Công ty chủ động chấm dứt hợp đồng)"],
                  ["EOC", "EOC — End of Contract", "(Hợp đồng kết thúc, không gia hạn)"],
                ].map(([v, main, sub]) => (
                  <label key={v} className={`tv-radio-card flex-col items-start ${data.exitType === v ? "tv-radio-card-selected" : ""}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="et" checked={data.exitType === v} onChange={() => setData({ ...data, exitType: v as any })} />
                      <span className="text-sm font-bold">{main}</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground ml-6">{sub}</div>
                  </label>
                ))}
              </div>
            </div>

            <div className="border-t border-border" />

            <Field label={<>Danh mục lý do chính <span className="req-mark">*</span> <span className="badge-missing ml-1">THIẾU</span></> as any}>
              <select value={data.reasonClassification ?? ""} onChange={(e) => setData({ ...data, reasonClassification: e.target.value })} className="tv-input">
                <option value="">— Chọn danh mục —</option>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>

            <Field label="Diễn giải thêm — theo đánh giá của Manager" required>
              <textarea rows={4} value={data.narrative ?? ""} onChange={(e) => setData({ ...data, narrative: e.target.value })} className="tv-input" placeholder="VD: Nhân sự nhận offer tại công ty khác với mức lương cao hơn ~30%. Đã trao đổi về lộ trình tăng lương nhưng không đạt được thỏa thuận..." />
            </Field>
          </>
        )}

        {step === 2 && (
          <>
            <SectionTitle>C  Đánh giá impact dự án</SectionTitle>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Dự án đang tham gia (billable)" autofill>
                <input readOnly value={(empInfo as any)?.des ?? "GlobalBank — QA Automation Suite"} className="tv-input bg-secondary" />
              </Field>
              <Field label="Utilization hiện tại" autofill>
                <input readOnly value={`${(empInfo as any)?.billable ?? 80}% (Billable)`} className="tv-input bg-secondary" />
              </Field>
            </div>

            <div>
              <label className="block text-sm font-bold mb-3">Nhân sự có critical với dự án? <span className="req-mark">*</span></label>
              <div className="grid grid-cols-3 gap-2">
                {[["critical", "🔴 Có — Critical Role"], ["normal", "🟡 Bình thường"], ["none", "🟢 Không ảnh hưởng"]].map(([v, l]) => (
                  <label key={v} className={`tv-radio-card ${data.critical === v ? "tv-radio-card-selected" : ""}`}>
                    <input type="radio" checked={data.critical === v} onChange={() => setData({ ...data, critical: v as any })} />
                    <span className="text-xs">{l}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-3">Cần Replacement? <span className="req-mark">*</span></label>
              <div className="grid grid-cols-3 gap-2">
                {[["yes", "✅ Có"], ["transfer", "🔄 Điều chuyển nội bộ"], ["no", "❌ Không"]].map(([v, l]) => (
                  <label key={v} className={`tv-radio-card ${data.replacement === v ? "tv-radio-card-selected" : ""}`}>
                    <input type="radio" checked={data.replacement === v} onChange={() => setData({ ...data, replacement: v as any })} />
                    <span className="text-xs">{l}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Thời hạn cần Replacement (nếu có)">
                <input type="date" value={data.replacementDeadline ?? ""} onChange={(e) => setData({ ...data, replacementDeadline: e.target.value })} className="tv-input" />
              </Field>
              <Field label="Ghi chú thêm về impact">
                <input value={data.impactNote ?? ""} onChange={(e) => setData({ ...data, impactNote: e.target.value })} className="tv-input" placeholder="VD: Đang deliver milestone Q2 cho client..." />
              </Field>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <SectionTitle>D  Xác nhận và Submit</SectionTitle>
            <div className="notice notice-info">
              <span>ℹ️</span>
              <div>Vui lòng kiểm tra lại toàn bộ thông tin trước khi submit. Sau khi submit, hệ thống sẽ tự động gửi thông báo đến C&B, HRBP và ITS.</div>
            </div>

            <div className="rounded-lg bg-secondary/40 border border-border p-5">
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                <div><span className="text-muted-foreground">Mã NV:</span> <b>{empInfo?.empId}</b></div>
                <div><span className="text-muted-foreground">Họ tên:</span> <b>{empInfo?.name}</b></div>
                <div><span className="text-muted-foreground">Level:</span> <b>{data.empLevel ?? "—"}</b></div>
                <div><span className="text-muted-foreground">DU:</span> <b>{off.department === "D2" ? "D3" : off.department}</b></div>
                <div><span className="text-muted-foreground">LWD:</span> <b>{data.lwd ?? "—"}</b></div>
                <div><span className="text-muted-foreground">Loại nghỉ:</span> <b style={{ color: "hsl(var(--destructive))" }}>{data.exitType ?? "—"}</b></div>
                <div className="col-span-2"><span className="text-muted-foreground">Danh mục:</span> <b>{data.reasonClassification ?? "—"}</b></div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-3">Xác nhận thông tin chính xác <span className="req-mark">*</span></label>
              <label className={`tv-radio-card ${data.confirmed ? "tv-radio-card-selected" : ""}`}>
                <input type="radio" checked={!!data.confirmed} onChange={() => setData({ ...data, confirmed: true })} />
                <span className="text-sm">✅ Tôi xác nhận thông tin chính xác</span>
              </label>
            </div>
          </>
        )}
      </div>

      <div className="rounded-b-2xl bg-card border border-border border-t-0 px-7 py-4 flex items-center justify-between">
        {step > 0 ? (
          <button onClick={() => setStep(step - 1)} className="flex items-center gap-1 rounded-lg border-[1.5px] border-brand-bright text-brand-bright px-4 py-2 text-[13px] font-bold hover:bg-brand-light">
            <ChevronLeft className="h-4 w-4" /> Quay lại
          </button>
        ) : <button onClick={() => setShowForm(false)} className="text-[13px] text-muted-foreground hover:text-foreground">← Đóng form</button>}
        <span className="text-xs text-muted-foreground">Bước {step + 1} / 4</span>
        {step < 3 ? (
          <button disabled={!canNext} onClick={() => setStep(step + 1)} className="flex items-center gap-1 rounded-lg bg-brand-bright text-white px-5 py-2 text-[13px] font-bold hover:bg-brand-hover disabled:opacity-40 disabled:cursor-not-allowed">
            Tiếp theo <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <button disabled={!canNext} onClick={submit} className="rounded-lg bg-[hsl(var(--destructive))] text-white px-6 py-2 text-[13px] font-bold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed">
            ✅ Submit Form
          </button>
        )}
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">{children}</div>;
}
function SubHeader({ children }: { children: React.ReactNode }) {
  return <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{children}</div>;
}
function Field({ label, required, autofill, children }: { label: any; required?: boolean; autofill?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
        {label} {required && <span className="req-mark">*</span>}
        {autofill && <span className="ml-1.5 badge-autofill">AUTO-FILL</span>}
      </label>
      {children}
    </div>
  );
}
