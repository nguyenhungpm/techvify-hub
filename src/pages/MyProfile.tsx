import { PageHeader } from "@/components/portal/PortalUI";
import { currentUser } from "@/lib/mockData";
import { Mail, Phone, IdCard, Calendar, Briefcase, UserCircle } from "lucide-react";

export default function MyProfile() {
  const rows = [
    { icon: UserCircle, label: "Họ và tên", value: currentUser.name },
    { icon: IdCard, label: "Mã NV", value: currentUser.empId },
    { icon: Briefcase, label: "Chức danh", value: `${currentUser.title} · ${currentUser.department}` },
    { icon: Phone, label: "Số điện thoại", value: currentUser.phone },
    { icon: Mail, label: "Email", value: currentUser.email },
    { icon: Calendar, label: "Ngày vào", value: currentUser.joinDate },
    { icon: UserCircle, label: "Loại hợp đồng", value: currentUser.contract },
    { icon: UserCircle, label: "Quản lý trực tiếp", value: `${currentUser.managerName} (${currentUser.managerEmpId})` },
  ];
  return (
    <div className="max-w-[960px]">
      <PageHeader title="My Profile" subtitle="Thông tin cá nhân — đồng bộ từ THRM" actions={<span className="badge-autofill">AUTO-FILL</span>} />
      <div className="tv-card overflow-hidden">
        <div className="bg-gradient-brand p-7 text-white flex items-center gap-5">
          <div className="grid h-20 w-20 place-items-center rounded-full bg-white/20 border-2 border-white/40 text-2xl font-extrabold">NT</div>
          <div>
            <div className="text-xl font-bold">{currentUser.name}</div>
            <div className="text-brand-soft text-sm">{currentUser.title} · {currentUser.department}</div>
            <div className="text-brand-soft text-xs mt-1">{currentUser.empId}</div>
          </div>
        </div>
        <div className="p-6 grid grid-cols-2 gap-x-8 gap-y-4">
          {rows.map((r) => (
            <div key={r.label} className="flex items-start gap-3">
              <r.icon className="h-4 w-4 text-brand-bright mt-1 shrink-0" />
              <div className="min-w-0">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{r.label}</div>
                <div className="text-sm font-medium text-foreground mt-0.5">{r.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <h2 className="text-base font-bold mt-8 mb-3">Hợp đồng</h2>
      <div className="tv-card p-5 flex items-center justify-between">
        <div>
          <div className="font-semibold text-sm">HĐLĐ chính thức không xác định thời hạn</div>
          <div className="text-xs text-muted-foreground mt-1">Số HĐ: HD-2022-0142 · Hiệu lực từ 15/03/2022</div>
        </div>
        <span className="status-done px-3 py-1 rounded-md text-[11px] font-bold">Đang hiệu lực</span>
      </div>
    </div>
  );
}
