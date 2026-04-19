import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { usePortalStore, ExitFormData } from "@/store/portalStore";
import { currentUser } from "@/lib/mockData";

const STEP_LABELS = ["Thông tin", "Lý do nghỉ", "Đánh giá", "Phản hồi"];

const CATEGORIES: { key: string; label: string; chips: string[] }[] = [
  { key: "💼 Vị trí & Vai trò", label: "💼 Vị trí & Vai trò", chips: [
    "Thời giờ làm việc","Địa điểm làm việc","Scope công việc không rõ ràng",
    "Công việc khác JD ban đầu","Khối lượng / áp lực công việc","Mức độ thử thách của công việc",
  ]},
  { key: "📁 Dự án & Quy trình", label: "📁 Dự án & Quy trình", chips: [
    "Hết dự án","Không có dự án phù hợp","Process chồng chéo, không hiệu quả","Process làm việc không rõ ràng",
  ]},
  { key: "👤 Quản lý & Dẫn dắt đội ngũ", label: "👤 Quản lý & Dẫn dắt đội ngũ", chips: [
    "Thiếu hỗ trợ / availability","Thiếu feedback & coaching","Phong cách quản lý không phù hợp",
    "Phân công, đánh giá hoặc ghi nhận chưa công bằng","Communication: Chưa thoải mái khi chia sẻ thẳng thắn",
  ]},
  { key: "💰 Lương & Đãi ngộ", label: "💰 Lương & Đãi ngộ", chips: [
    "Lương cơ bản","Khoản thưởng và Hoa hồng","Có offer mới cao hơn",
    "Mức lương sau review chưa thỏa đáng","Công bằng nội bộ","Cơ chế ghi nhận (spot reward, recognition)",
  ]},
  { key: "🚀 Thăng tiến & Phát triển", label: "🚀 Thăng tiến & Phát triển", chips: [
    "Không có lộ trình thăng tiến rõ ràng","Thiếu cơ hội học hỏi","Không được giao công việc thử thách","Không thấy cơ hội thăng tiến",
  ]},
  { key: "🏢 Văn hóa & Năng lực", label: "🏢 Văn hóa & Năng lực", chips: [
    "Công bằng và minh bạch","Cách ra quyết định chưa thỏa đáng","Cách phối hợp liên phòng ban","Chính trị nội bộ","Năng lực chưa đáp ứng",
  ]},
  { key: "🌱 Chủ quan & Khách quan", label: "🌱 Chủ quan & Khách quan", chips: [
    "Gia đình","Sức khoẻ cá nhân","Định hướng sống","Định hướng học tập",
    "Định hướng công việc","Cơ hội cá nhân đặc thù","Nghĩa vụ quân sự",
  ]},
  { key: "📌 Khác", label: "📌 Khác", chips: [] },
];

const today = () => new Date().toISOString().slice(0, 10);

export default function ExitForm() {
  const navigate = useNavigate();
  const upsert = usePortalStore((s) => s.upsertOffboarding);
  const offboardings = usePortalStore((s) => s.offboardings);

  const [step, setStep] = useState(0);
  const [data, setData] = useState<ExitFormData>({
    noticeDate: today(),
    reasonsByCategory: {},
  });
  const [openAcc, setOpenAcc] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const toggleChip = (cat: string, chip: string) => {
    const cur = data.reasonsByCategory?.[cat] ?? [];
    const next = cur.includes(chip) ? cur.filter((c) => c !== chip) : [...cur, chip];
    setData({ ...data, reasonsByCategory: { ...(data.reasonsByCategory ?? {}), [cat]: next } });
  };

  const totalSelected = Object.values(data.reasonsByCategory ?? {}).reduce((a, b) => a + b.length, 0);

  const canNext =
    step === 0 ? !!data.lwd
    : step === 1 ? (totalSelected > 0 || !!(data.otherReason && data.otherReason.trim())) && !!data.primaryCategory
    : step === 2 ? !!(data.nextJobAttraction && data.nextJobAttraction.trim())
    : step === 3 ? !!data.comebackChoice
    : true;

  const submit = () => {
    const id = "off-" + currentUser.empId + "-" + Date.now();
    const flatDetails = Object.values(data.reasonsByCategory ?? {}).flat();
    upsert({
      id,
      empId: currentUser.empId,
      empName: currentUser.name,
      title: currentUser.title,
      department: currentUser.department,
      submittedAt: new Date().toISOString(),
      lwd: data.lwd ?? "",
      status: "pending_manager",
      exitForm: {
        ...data,
        // Backward-compat mirrors so PplResult comparison still works
        primaryReason: data.primaryCategory,
        detailReasons: flatDetails,
        comeback: data.comebackChoice === "yes" ? "yes" : data.comebackChoice === "maybe" ? "maybe" : data.comebackChoice === "never" ? "no" : undefined,
        refer: data.referChoice === "yes" ? "yes" : data.referChoice === "no" ? "no" : undefined,
        improvement: data.improvementSuggestion,
        submittedAt: new Date().toISOString(),
      },
      managerForm: undefined,
      cb: Array(7).fill(false),
      its: Array(9).fill(false),
      admin: Array(4).fill(false),
    });
    setDone(true);
  };

  if (done) return (
    <div className="max-w-[740px] mx-auto">
      <div className="tv-card p-10 text-center animate-fade-in">
        <div className="text-5xl">🙏</div>
        <h1 className="text-[22px] font-extrabold mt-4">Cảm ơn bạn đã chia sẻ</h1>
        <p className="text-muted-foreground text-sm mt-2 max-w-md mx-auto">
          Phản hồi của bạn đã được ghi nhận bảo mật. Mọi ý kiến đều giúp Techvify trở thành nơi làm việc tốt hơn.
        </p>
        <div className="mt-6 space-y-2 text-left max-w-md mx-auto">
          {[
            "🔒 Dữ liệu được mã hóa và bảo mật",
            "📋 HRBP nhận notification để tiến hành bàn giao",
            "📊 Dữ liệu sẽ được aggregate ẩn danh vào Turnover Report",
          ].map((s, i) => (
            <div key={i} className="rounded-md text-[13px] px-3 py-2" style={{ background: "hsl(142 76% 96%)", border: "1px solid hsl(141 79% 85%)", color: "hsl(142 71% 30%)" }}>{s}</div>
          ))}
        </div>
        <button onClick={() => navigate("/request/my")} className="mt-7 rounded-lg bg-brand-bright text-white px-6 py-2.5 text-sm font-bold hover:bg-brand-hover">
          ← Quay lại My Request
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-[740px] mx-auto">
      {/* Header */}
      <div className="rounded-t-2xl bg-gradient-brand text-white p-7">
        <div className="text-[11px] font-bold uppercase tracking-[0.15em] text-brand-soft">FORM 03 · EXIT EMPLOYEE · STEP {step + 1}</div>
        <h1 className="text-[22px] font-extrabold mt-1">Employee Exit Form & Exit Interview</h1>
        <p className="text-brand-soft text-[13px] mt-1">
          Toàn bộ nội dung tại form này sẽ được <b>bảo mật tuyệt đối</b> — chỉ HRBP & CHRO xem được dưới dạng ẩn danh nhằm cải thiện môi trường làm việc.
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="bg-white/15 border border-white/30 px-2.5 py-1 rounded-md text-xs font-semibold">🔒 Confidential</span>
          <span className="bg-white/15 border border-white/30 px-2.5 py-1 rounded-md text-xs font-semibold">👤 Exit Employee</span>
          <span className="bg-white/15 border border-white/30 px-2.5 py-1 rounded-md text-xs font-semibold">⏱ Trong ngày thông báo</span>
        </div>
      </div>

      {/* Stepper */}
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

      {/* Body */}
      <div className="bg-card border-x border-border p-7 min-h-[380px] space-y-5">
        {step === 0 && (
          <>
            <SectionTitle>A  Thông tin nhân viên</SectionTitle>
            <Grid2>
              <Field label="Mã số nhân viên" autofill><input readOnly value={currentUser.empId} className="tv-input bg-secondary" /></Field>
              <Field label="Họ và tên" autofill><input readOnly value={currentUser.name} className="tv-input bg-secondary" /></Field>
            </Grid2>
            <Grid2>
              <Field label="Chức danh hiện tại"><input readOnly value={currentUser.title} className="tv-input bg-secondary" /></Field>
              <Field label="Ban / Phòng"><input readOnly value={"Delivery Unit " + currentUser.department} className="tv-input bg-secondary" /></Field>
            </Grid2>
            <Grid2>
              <Field label="Loại hợp đồng"><input readOnly value={currentUser.contract} placeholder="Auto-fill từ THRM (VD: Chính thức / Thử việc / CTV)" className="tv-input bg-secondary" /></Field>
              <Field label="Người quản lý trực tiếp"><input readOnly value={currentUser.managerName} className="tv-input bg-secondary" /></Field>
            </Grid2>
            <Grid2>
              <Field label="Ngày thông báo xin nghỉ" required>
                <input readOnly type="date" value={data.noticeDate} className="tv-input bg-secondary" />
              </Field>
              <div />
            </Grid2>
            <Field label="Ngày chấm dứt HĐLĐ / Ngày làm việc cuối cùng" required>
              <input type="date" value={data.lwd ?? ""} onChange={(e) => setData({ ...data, lwd: e.target.value })} className="tv-input" />
              <div className="text-[11px] text-muted-foreground mt-1.5">Tối thiểu 30 ngày kể từ ngày thông báo theo quy định hợp đồng</div>
            </Field>
          </>
        )}

        {step === 1 && (
          <>
            <SectionTitle>B  Lý do nghỉ việc</SectionTitle>
            <div>
              <label className="block text-sm font-bold mb-3">
                Câu 4. Lý do bạn quyết định rời đi? <span className="req-mark">*</span>{" "}
                <span className="text-xs text-muted-foreground font-normal">(chọn tất cả các mục phù hợp)</span>
              </label>
              <div className="space-y-2">
                {CATEGORIES.map((cat) => {
                  const open = openAcc === cat.key;
                  const cnt = (data.reasonsByCategory?.[cat.key] ?? []).length;
                  return (
                    <div key={cat.key} className="rounded-lg border border-border bg-card overflow-hidden">
                      <button type="button" onClick={() => setOpenAcc(open ? null : cat.key)} className="w-full flex justify-between items-center px-4 py-3 hover:bg-secondary/40">
                        <span className="font-semibold text-sm">{cat.label}</span>
                        <span className="flex items-center gap-2">
                          {cnt > 0 && <span className="bg-brand-bright text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{cnt}</span>}
                          <ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} />
                        </span>
                      </button>
                      {open && (
                        <div className="p-4 border-t border-border bg-secondary/20">
                          {cat.chips.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {cat.chips.map((chip) => {
                                const sel = (data.reasonsByCategory?.[cat.key] ?? []).includes(chip);
                                return (
                                  <button key={chip} type="button" onClick={() => toggleChip(cat.key, chip)} className={`tv-chip ${sel ? "tv-chip-selected" : ""}`}>
                                    {sel && "✓ "}{chip}
                                  </button>
                                );
                              })}
                            </div>
                          ) : (
                            <textarea value={data.otherReason ?? ""} onChange={(e) => setData({ ...data, otherReason: e.target.value })} rows={3} className="tv-input" placeholder="Mô tả lý do cụ thể..." />
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-border" />

            <Field label="Câu 6. Nếu phải chọn 01 danh mục quan trọng nhất khiến bạn rời đi?" required>
              <select value={data.primaryCategory ?? ""} onChange={(e) => setData({ ...data, primaryCategory: e.target.value })} className="tv-input">
                <option value="">— Chọn danh mục —</option>
                {CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
              </select>
            </Field>
          </>
        )}

        {step === 2 && (
          <>
            <SectionTitle>C  Đánh giá trải nghiệm làm việc</SectionTitle>
            <Field label="Câu 5. Điều gì làm bạn hài lòng / ấn tượng nhất khi làm việc tại Techvify?">
              <textarea rows={3} value={data.satisfactionText ?? ""} onChange={(e) => setData({ ...data, satisfactionText: e.target.value })} className="tv-input" placeholder="Chia sẻ tự do — đây là thông tin quý giá giúp Techvify phát triển..." />
            </Field>
            <Field label="Câu 6. Chính sách hay thủ tục của Công ty đã từng cản bạn hoàn thành công việc với 100% khả năng?">
              <textarea rows={3} value={data.policyBlocker ?? ""} onChange={(e) => setData({ ...data, policyBlocker: e.target.value })} className="tv-input" placeholder="Mô tả cụ thể nếu có..." />
            </Field>
            <Field label="Câu 7. Điều gì sẽ thu hút bạn nhất ở công việc sắp tới?" required>
              <textarea rows={3} value={data.nextJobAttraction ?? ""} onChange={(e) => setData({ ...data, nextJobAttraction: e.target.value })} className="tv-input" placeholder="VD: Cơ hội phát triển kỹ năng, môi trường quốc tế, mức lương cạnh tranh hơn, work-life balance..." />
            </Field>
          </>
        )}

        {step === 3 && (
          <>
            <SectionTitle>D  Phản hồi & Xác nhận</SectionTitle>
            <Field label="Câu 8. Bạn mong muốn Techvify cải tiến / thay đổi những gì trong thời gian tới?">
              <textarea rows={3} value={data.improvementSuggestion ?? ""} onChange={(e) => setData({ ...data, improvementSuggestion: e.target.value })} className="tv-input" placeholder="Góp ý tự do — mọi ý kiến đều được lắng nghe và tổng hợp để cải thiện môi trường làm việc..." />
            </Field>

            <div className="border-t border-border" />

            <div>
              <label className="block text-sm font-bold mb-3">Câu 9. Trong tương lai bạn có cân nhắc quay lại Techvify không? <span className="req-mark">*</span></label>
              <div className="space-y-2">
                {[
                  ["never", "❌ Không bao giờ"],
                  ["maybe", "🤔 Có thể, nếu Techvify thay đổi một số yếu tố"],
                  ["yes", "✅ Sẵn sàng quay lại nếu có cơ hội phù hợp"],
                ].map(([v, l]) => (
                  <label key={v} className={`tv-radio-card ${data.comebackChoice === v ? "tv-radio-card-selected" : ""}`}>
                    <input type="radio" name="cb" checked={data.comebackChoice === v} onChange={() => setData({ ...data, comebackChoice: v as any })} />
                    <span className="text-sm">{l}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="border-t border-border" />

            <div>
              <label className="block text-sm font-bold mb-3">Câu 10. Bạn có sẵn sàng giới thiệu người quen vào làm việc tại Techvify không?</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  ["yes", "✅ Có, tôi muốn giới thiệu"],
                  ["maybe", "🤔 Có thể, nếu có vị trí phù hợp"],
                  ["no", "❌ Không"],
                ].map(([v, l]) => (
                  <label key={v} className={`tv-radio-card ${data.referChoice === v ? "tv-radio-card-selected" : ""}`}>
                    <input type="radio" name="refer" checked={data.referChoice === v} onChange={() => setData({ ...data, referChoice: v as any })} />
                    <span className="text-xs">{l}</span>
                  </label>
                ))}
              </div>

              {(data.referChoice === "yes" || data.referChoice === "maybe") && (
                <div className="mt-4 rounded-lg border-[1.5px] border-border bg-secondary/40 p-4">
                  <div className="text-[11.5px] font-bold uppercase text-muted-foreground mb-3">Thông tin người được giới thiệu (nếu đã có ứng viên cụ thể)</div>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Họ và tên"><input className="tv-input" placeholder="Nguyễn Văn B" value={data.referName ?? ""} onChange={(e) => setData({ ...data, referName: e.target.value })} /></Field>
                    <Field label="Số điện thoại"><input className="tv-input" placeholder="09xx xxx xxx" value={data.referPhone ?? ""} onChange={(e) => setData({ ...data, referPhone: e.target.value })} /></Field>
                    <Field label="Vị trí phù hợp"><input className="tv-input" placeholder="VD: Senior Developer, QA Engineer..." value={data.referPosition ?? ""} onChange={(e) => setData({ ...data, referPosition: e.target.value })} /></Field>
                    <Field label="Email"><input className="tv-input" placeholder="example@email.com" value={data.referEmail ?? ""} onChange={(e) => setData({ ...data, referEmail: e.target.value })} /></Field>
                  </div>
                  <div className="mt-3">
                    <Field label="Ghi chú thêm"><input className="tv-input" placeholder="VD: Bạn cùng trường, đang tìm kiếm cơ hội mới, strong về React..." value={data.referNote ?? ""} onChange={(e) => setData({ ...data, referNote: e.target.value })} /></Field>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-border" />

            <div className="notice notice-confidential text-[13px]">
              🔒 Tôi xác nhận đã điền đầy đủ và trung thực. Toàn bộ thông tin được bảo mật, chỉ dùng cho mục đích cải thiện tổ chức.
            </div>
          </>
        )}
      </div>

      {/* Nav */}
      <div className="rounded-b-2xl bg-card border border-border border-t-0 px-7 py-4 flex items-center justify-between">
        {step > 0 ? (
          <button onClick={() => setStep(step - 1)} className="flex items-center gap-1 rounded-lg border-[1.5px] border-brand-bright text-brand-bright px-4 py-2 text-[13px] font-bold hover:bg-brand-light">
            <ChevronLeft className="h-4 w-4" /> Quay lại
          </button>
        ) : <span />}
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

function Grid2({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-4">{children}</div>;
}

function Field({ label, required, autofill, children }: { label: string; required?: boolean; autofill?: boolean; children: React.ReactNode }) {
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
