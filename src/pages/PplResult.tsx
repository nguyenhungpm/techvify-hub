import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PageHeader } from "@/components/portal/PortalUI";
import { usePortalStore } from "@/store/portalStore";
import { Lock, ChevronDown } from "lucide-react";

const Cell = ({ children }: { children: React.ReactNode }) => (
  <div className="text-sm text-foreground">{children}</div>
);

export default function PplResult() {
  const [params] = useSearchParams();
  const id = params.get("id");
  const offboardings = usePortalStore((s) => s.offboardings);
  const update = usePortalStore((s) => s.updateOffboarding);
  const [selectedId, setSelectedId] = useState(id ?? offboardings[0]?.id);
  const off = offboardings.find((o) => o.id === selectedId);
  const [notes, setNotes] = useState(off?.pplNotes ?? "");
  const [intDate, setIntDate] = useState(off?.exitInterviewDate ?? "");
  const [intResult, setIntResult] = useState(off?.exitInterviewResult ?? "");
  const [openEmp, setOpenEmp] = useState(false);
  const [openMgr, setOpenMgr] = useState(false);

  if (!off) return <div className="p-8">Không có case</div>;

  const ef = off.exitForm;
  const mf = off.managerForm;
  const reasonMatch = ef && mf && ef.primaryReason === mf.reasonClassification;

  return (
    <div className="max-w-[1100px] space-y-6">
      <PageHeader
        title="Quản lý kết quả Offboarding"
        subtitle="Đối chiếu Employee Form & Manager Form"
        actions={
          <select value={selectedId} onChange={(e) => { setSelectedId(e.target.value); }} className="tv-input max-w-xs">
            {offboardings.map((o) => <option key={o.id} value={o.id}>{o.empName} · {o.empId}</option>)}
          </select>
        }
      />

      {/* Header card */}
      <div className="rounded-xl bg-gradient-brand text-white p-6">
        <div className="text-xs uppercase tracking-wider text-brand-soft font-semibold">CASE OFFBOARDING</div>
        <div className="text-2xl font-extrabold mt-1">{off.empName} · {off.empId}</div>
        <div className="text-brand-soft text-sm mt-1">{off.title} · {off.department} · Ngày gửi {new Date(off.submittedAt).toLocaleDateString("vi-VN")} · LWD {off.lwd}</div>
      </div>

      {/* Comparison */}
      <div className="tv-card overflow-hidden">
        <div className="grid grid-cols-2 divide-x divide-border">
          <div className="bg-brand-light/40 p-5 font-bold text-sm">📋 NHÂN VIÊN nói</div>
          <div className="bg-secondary/40 p-5 font-bold text-sm">👔 MANAGER đánh giá</div>
        </div>

        {/* Reason */}
        <Row label="Lý do chính / Phân loại">
          <Cell>{ef?.primaryReason ?? "—"}</Cell>
          <div className="flex items-center justify-between gap-3">
            {mf ? (
              <>
                <Cell>{mf.reasonClassification}</Cell>
                <span className={`px-2 py-1 rounded text-[10px] font-bold ${reasonMatch ? "status-done" : "status-rejected"}`}>{reasonMatch ? "🟢 MATCH" : "🔴 MISMATCH"}</span>
              </>
            ) : <Confidential />}
          </div>
        </Row>

        <Row label="Lý do chi tiết / Loại nghỉ">
          <Cell>
            <ul className="list-disc list-inside space-y-0.5">
              {(ef?.detailReasons ?? []).map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </Cell>
          <Cell>
            {mf ? (
              <>
                <div className="font-semibold">{mf.exitType === "VOL" ? "VOL — Voluntary" : mf.exitType === "INVOL" ? "INVOL — Involuntary" : "—"}</div>
                <div className="text-xs text-muted-foreground mt-1 italic">"{mf.narrative}"</div>
              </>
            ) : <Confidential />}
          </Cell>
        </Row>

        <Row label="Quay lại / Critical">
          <Cell>{ef?.comeback === "yes" ? "✅ Có" : ef?.comeback === "maybe" ? "🤔 Có thể" : ef?.comeback === "no" ? "❌ Không" : "—"}</Cell>
          <Cell>{mf ? (mf.criticality === "low" ? "🟢 Thấp" : mf.criticality === "normal" ? "🟡 Bình thường" : "🔴 Cao") : <Confidential />}</Cell>
        </Row>

        <Row label="Giới thiệu / Replacement">
          <Cell>{ef?.refer === "yes" ? "✅ Có" : ef?.refer === "no" ? "❌ Không" : "—"}</Cell>
          <Cell>{mf ? (mf.needReplacement === "yes" ? `✅ Có · Trước ${mf.replacementBy ?? "—"}` : "❌ Không") : <Confidential />}</Cell>
        </Row>

        {/* Expand */}
        <div className="grid grid-cols-2 divide-x divide-border border-t border-border">
          <div className="p-3">
            <button onClick={() => setOpenEmp(!openEmp)} className="text-[13px] text-brand-bright font-semibold flex items-center gap-1 w-full">
              <ChevronDown className={`h-4 w-4 transition ${openEmp ? "rotate-180" : ""}`} />
              Xem toàn bộ Employee Form
            </button>
            {openEmp && ef && (
              <div className="text-xs space-y-1.5 mt-3 p-3 bg-secondary/30 rounded">
                <div><b>Ghi chú:</b> {ef.notes ?? "—"}</div>
                <div><b>Công việc tiếp theo:</b> {ef.newJob ?? "—"}</div>
                <div><b>LWD:</b> {ef.lwd ?? "—"}</div>
                <div><b>Bàn giao cho:</b> {ef.handoverPerson ?? "—"}</div>
                <div><b>Phép còn lại:</b> {ef.remainingLeave ?? "—"}</div>
                <div><b>Hài lòng:</b> {"★".repeat(ef.satisfaction ?? 0)}</div>
                <div><b>Cải thiện:</b> {ef.improvement ?? "—"}</div>
              </div>
            )}
          </div>
          <div className="p-3">
            <button onClick={() => setOpenMgr(!openMgr)} disabled={!mf} className="text-[13px] text-brand-bright font-semibold flex items-center gap-1 w-full disabled:opacity-40">
              <ChevronDown className={`h-4 w-4 transition ${openMgr ? "rotate-180" : ""}`} />
              Xem toàn bộ Manager Form
            </button>
            {openMgr && mf && (
              <div className="text-xs space-y-1.5 mt-3 p-3 bg-secondary/30 rounded">
                <div><b>Diễn giải:</b> {mf.narrative}</div>
                <div><b>Tri thức bàn giao:</b> {(mf.knowledgeTransfer ?? []).join(", ") || "—"}</div>
                <div><b>Rủi ro:</b> {mf.riskNotes ?? "—"}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PPL workspace */}
      <div className="grid grid-cols-2 gap-5">
        <div className="tv-card p-5">
          <h3 className="font-bold text-sm mb-3">📝 Ghi chú nội bộ PPL</h3>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={5} className="tv-input" placeholder="Quan sát, hành động, follow-up..." />
          <button onClick={() => update(off.id, { pplNotes: notes })} className="mt-3 rounded-lg bg-brand-bright text-white px-4 py-2 text-[13px] font-bold hover:bg-brand-hover">Lưu ghi chú</button>
        </div>
        <div className="tv-card p-5">
          <h3 className="font-bold text-sm mb-3">📅 Exit Interview</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Ngày phỏng vấn</label>
              <input type="date" value={intDate} onChange={(e) => setIntDate(e.target.value)} className="tv-input mt-1.5" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Kết quả</label>
              <textarea value={intResult} onChange={(e) => setIntResult(e.target.value)} rows={2} className="tv-input mt-1.5" placeholder="Tóm tắt kết quả..." />
            </div>
            <button onClick={() => update(off.id, { exitInterviewDate: intDate, exitInterviewResult: intResult })} className="rounded-lg bg-brand-bright text-white px-4 py-2 text-[13px] font-bold hover:bg-brand-hover">Ghi nhận kết quả</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: [React.ReactNode, React.ReactNode] }) {
  return (
    <div className="border-t border-border">
      <div className="px-5 py-2 bg-secondary/20 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="grid grid-cols-2 divide-x divide-border">
        <div className="p-4">{children[0]}</div>
        <div className="p-4">{children[1]}</div>
      </div>
    </div>
  );
}

function Confidential() {
  return (
    <div className="notice notice-confidential text-xs">
      <Lock className="h-4 w-4 shrink-0" />
      <span>Manager chưa gửi form — nội dung được bảo mật</span>
    </div>
  );
}
