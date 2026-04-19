import { useNavigate } from "react-router-dom";
import { PageHeader, StatusBadge } from "@/components/portal/PortalUI";
import { usePortalStore } from "@/store/portalStore";

const Dot = ({ done }: { done: number }) => (
  <span title={done === 2 ? "Hoàn thành" : done === 1 ? "Đang xử lý" : "Chưa bắt đầu"}>
    {done === 2 ? "🟢" : done === 1 ? "🟡" : "⚪"}
  </span>
);

export default function PplList() {
  const navigate = useNavigate();
  const offboardings = usePortalStore((s) => s.offboardings);

  const score = (arr: boolean[], doneFlag?: boolean) => {
    if (doneFlag) return 2;
    const c = arr.filter(Boolean).length;
    return c === 0 ? 0 : 1;
  };

  return (
    <div className="max-w-[1300px]">
      <PageHeader title="Danh sách Offboarding" subtitle="Tất cả case offboarding của công ty" />
      <div className="tv-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-xs uppercase tracking-wide text-muted-foreground">
            <tr className="text-left">
              <th className="px-4 py-3 font-semibold">Nhân viên</th>
              <th className="px-4 py-3 font-semibold">Mã NV</th>
              <th className="px-4 py-3 font-semibold">DU</th>
              <th className="px-4 py-3 font-semibold">Ngày gửi</th>
              <th className="px-4 py-3 font-semibold">LWD</th>
              <th className="px-4 py-3 font-semibold text-center">Mgr Form</th>
              <th className="px-4 py-3 font-semibold text-center">C&B</th>
              <th className="px-4 py-3 font-semibold text-center">ITS</th>
              <th className="px-4 py-3 font-semibold text-center">Admin</th>
              <th className="px-4 py-3 font-semibold text-center">PPL</th>
              <th className="px-4 py-3 font-semibold">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {offboardings.map((o) => (
              <tr key={o.id} onClick={() => navigate(`/ppl/result?id=${o.id}`)} className="border-t hover:bg-secondary/30 transition cursor-pointer">
                <td className="px-4 py-3 font-medium">{o.empName}</td>
                <td className="px-4 py-3 text-muted-foreground">{o.empId}</td>
                <td className="px-4 py-3">{o.department}</td>
                <td className="px-4 py-3 text-muted-foreground">{new Date(o.submittedAt).toLocaleDateString("vi-VN")}</td>
                <td className="px-4 py-3">{o.lwd}</td>
                <td className="px-4 py-3 text-center"><Dot done={o.managerForm ? 2 : 0} /></td>
                <td className="px-4 py-3 text-center"><Dot done={score(o.cb, o.cbDone)} /></td>
                <td className="px-4 py-3 text-center"><Dot done={score(o.its, o.itsDone)} /></td>
                <td className="px-4 py-3 text-center"><Dot done={score(o.admin, o.adminDone)} /></td>
                <td className="px-4 py-3 text-center"><Dot done={o.pplNotes ? 2 : 0} /></td>
                <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
