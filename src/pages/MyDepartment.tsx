import { PageHeader, StatusBadge } from "@/components/portal/PortalUI";
import { teamD2, currentUser } from "@/lib/mockData";

export default function MyDepartment() {
  return (
    <div className="max-w-[1100px]">
      <PageHeader title={`Team ${currentUser.department} — ${currentUser.managerName}`} subtitle={`${teamD2.length} thành viên`} />
      <div className="tv-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50">
            <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-5 py-3 font-semibold">Tên</th>
              <th className="px-5 py-3 font-semibold">Mã NV</th>
              <th className="px-5 py-3 font-semibold">Chức danh</th>
              <th className="px-5 py-3 font-semibold">Loại HĐ</th>
              <th className="px-5 py-3 font-semibold">Ngày vào</th>
              <th className="px-5 py-3 font-semibold">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {teamD2.map((m) => (
              <tr key={m.empId} className="border-t hover:bg-secondary/30 transition">
                <td className="px-5 py-3 font-medium">{m.name}</td>
                <td className="px-5 py-3 text-muted-foreground">{m.empId}</td>
                <td className="px-5 py-3">{m.title}</td>
                <td className="px-5 py-3">{m.contract}</td>
                <td className="px-5 py-3 text-muted-foreground">{m.joinDate}</td>
                <td className="px-5 py-3"><StatusBadge status={m.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-base font-bold mt-8 mb-3">DES — Phân bổ dự án</h2>
      <div className="tv-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50">
            <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-5 py-3 font-semibold">Mã NV</th>
              <th className="px-5 py-3 font-semibold">Dự án</th>
              <th className="px-5 py-3 font-semibold">Billable</th>
            </tr>
          </thead>
          <tbody>
            {teamD2.map((m) => (
              <tr key={m.empId} className="border-t">
                <td className="px-5 py-3">{m.empId}</td>
                <td className="px-5 py-3">{m.des}</td>
                <td className="px-5 py-3 font-semibold text-brand-bright">{m.billable}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
