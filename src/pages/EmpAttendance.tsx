import { PageHeader } from "@/components/portal/PortalUI";
import { teamTimesheet } from "@/lib/mockData";

export default function EmpAttendance() {
  return (
    <div className="max-w-[1200px]">
      <PageHeader title="Emp Attendance" subtitle="Theo dõi chấm công cả team" />
      <div className="bg-gradient-brand text-white rounded-xl p-5 mb-5 flex items-center justify-between">
        <div>
          <div className="text-brand-soft text-xs font-semibold uppercase tracking-wider">Team D2 · Tuần 14–18/04</div>
          <div className="text-xl font-extrabold mt-1">5 thành viên</div>
        </div>
        <div className="flex gap-5 text-sm">
          <div><span className="text-success">●</span> 3 đủ công</div>
          <div><span className="text-warning">●</span> 1 thiếu</div>
          <div><span className="text-[hsl(var(--destructive))]">●</span> 1 chưa chấm</div>
        </div>
      </div>

      <div className="notice notice-warn mb-5">
        <span>⚠️</span>
        <div>
          <div className="font-bold">Cảnh báo bất thường</div>
          <div className="text-xs mt-1">Trần Thị Hoa thiếu công 6g vào T5 17/04. Đặng Quốc Bảo chưa chấm T6 18/04.</div>
        </div>
      </div>

      <div className="tv-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="text-left px-5 py-3 font-semibold">Nhân viên</th>
              <th className="px-3 py-3 font-semibold">T2</th>
              <th className="px-3 py-3 font-semibold">T3</th>
              <th className="px-3 py-3 font-semibold">T4</th>
              <th className="px-3 py-3 font-semibold">T5</th>
              <th className="px-3 py-3 font-semibold">T6</th>
            </tr>
          </thead>
          <tbody>
            {teamTimesheet.map((r) => (
              <tr key={r.empId} className="border-t hover:bg-secondary/30">
                <td className="px-5 py-3"><div className="font-medium">{r.name}</div><div className="text-xs text-muted-foreground">{r.empId}</div></td>
                {r.days.map((d, i) => (
                  <td key={i} className="text-center px-3 py-3">
                    {d === "✓" && <span className="text-success font-bold">✓</span>}
                    {d === "—" && <span className="text-muted-foreground">—</span>}
                    {d.startsWith("⚠️") && <span className="text-warning font-bold">{d}</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
