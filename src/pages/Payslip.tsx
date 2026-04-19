import { PageHeader } from "@/components/portal/PortalUI";
import { payslip, formatVND } from "@/lib/mockData";

export default function Payslip() {
  return (
    <div className="max-w-[800px]">
      <PageHeader title="Phiếu lương" subtitle={payslip.period} />
      <div className="tv-card overflow-hidden">
        <div className="bg-gradient-brand p-6 text-white">
          <div className="text-brand-soft text-xs uppercase tracking-wider font-semibold">Thực lĩnh kỳ này</div>
          <div className="text-4xl font-extrabold mt-1">{formatVND(payslip.netPay)}</div>
          <div className="text-brand-soft text-sm mt-2">{payslip.period}</div>
        </div>
        <div className="p-6 space-y-5">
          <div>
            <h3 className="font-bold text-sm mb-3 text-success">▲ Thu nhập</h3>
            <div className="space-y-2 text-sm">
              {payslip.income.map((r) => (
                <div key={r.label} className="flex justify-between"><span className="text-muted-foreground">{r.label}</span><span className="font-semibold">{formatVND(r.value)}</span></div>
              ))}
              <div className="flex justify-between border-t border-border pt-2 font-bold"><span>Tổng thu</span><span>{formatVND(payslip.totalIncome)}</span></div>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-sm mb-3 text-[hsl(var(--destructive))]">▼ Khấu trừ</h3>
            <div className="space-y-2 text-sm">
              {payslip.deductions.map((r) => (
                <div key={r.label} className="flex justify-between"><span className="text-muted-foreground">{r.label}</span><span className="font-semibold">−{formatVND(r.value)}</span></div>
              ))}
              <div className="flex justify-between border-t border-border pt-2 font-bold"><span>Tổng trừ</span><span>−{formatVND(payslip.totalDeductions)}</span></div>
            </div>
          </div>
          <div className="flex justify-between bg-brand-light rounded-lg p-4">
            <span className="font-bold text-brand-hover">Thực lĩnh</span>
            <span className="text-xl font-extrabold text-brand-hover">{formatVND(payslip.netPay)}</span>
          </div>
        </div>
      </div>

      <h2 className="text-base font-bold mt-8 mb-3">Lịch sử</h2>
      <div className="space-y-2">
        {["Tháng 03/2026", "Tháng 02/2026", "Tháng 01/2026"].map((m) => (
          <div key={m} className="tv-card p-4 flex justify-between items-center hover:shadow-elevated transition cursor-pointer">
            <div>
              <div className="font-semibold text-sm">{m}</div>
              <div className="text-xs text-muted-foreground mt-0.5">Đã thanh toán</div>
            </div>
            <span className="font-bold text-brand-bright">{formatVND(30_525_000)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
