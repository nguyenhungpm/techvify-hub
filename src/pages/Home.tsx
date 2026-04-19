import { Plus, FileCheck, Info, Wallet, Mail, Phone, IdCard, User, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { currentUser } from "@/lib/mockData";
import { usePortalStore } from "@/store/portalStore";
import { SectionHeader } from "@/components/portal/PortalUI";

interface QuickAction { icon: any; label: string; badge?: number; to: string; }

function QuickAction({ icon: Icon, label, badge, to }: QuickAction) {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate(to)} className="flex flex-col items-center gap-2 group">
      <div className="quick-action-btn">
        <Icon className="h-[26px] w-[26px]" />
        {badge !== undefined && badge > 0 && <span className="badge-count">{badge}</span>}
      </div>
      <span className="text-xs font-semibold text-foreground text-center max-w-[88px] leading-tight">{label}</span>
    </button>
  );
}

interface TaskCardProps { eyebrow: string; title: string; meta: string; sla?: string; borderColor: string; cta: string; onClick: () => void; }
function TaskCard({ eyebrow, title, meta, sla, borderColor, cta, onClick }: TaskCardProps) {
  return (
    <div className="tv-card p-4 flex items-center justify-between gap-4 border-l-4 animate-fade-in" style={{ borderLeftColor: borderColor }}>
      <div className="min-w-0">
        <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{eyebrow}</div>
        <div className="font-bold text-sm text-foreground mt-0.5">{title}</div>
        <div className="text-[13px] text-muted-foreground mt-0.5">{meta}</div>
        {sla && <div className="mt-1.5 inline-flex items-center gap-1 status-rejected px-2 py-0.5 rounded text-[10px] font-bold">SLA: {sla}</div>}
      </div>
      <button onClick={onClick} className="shrink-0 rounded-lg bg-brand-bright text-white px-4 py-2 text-[13px] font-bold hover:bg-brand-hover transition">{cta}</button>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const approvals = usePortalStore((s) => s.approvals).filter((a) => a.status === "pending");
  const offboardings = usePortalStore((s) => s.offboardings);
  const hoa = offboardings.find((o) => o.id === "off-hoa");

  const tasks: TaskCardProps[] = [];
  if (hoa && !hoa.managerForm) {
    tasks.push({
      eyebrow: "🚪 OFFBOARDING — Trần Thị Hoa",
      title: "Đã gửi yêu cầu nghỉ việc 3 ngày trước",
      meta: "Cần fill Manager Confirmation Form",
      sla: "QUÁ HẠN",
      borderColor: "hsl(var(--destructive))",
      cta: "Xử lý ngay →",
      onClick: () => navigate(`/manager-form/${hoa.id}`),
    });
  }
  approvals.forEach((a) => tasks.push({
    eyebrow: "✅ PHÊ DUYỆT — " + a.submitterName,
    title: `${a.typeLabel} · ${a.date}`,
    meta: a.detail,
    borderColor: "hsl(var(--warning))",
    cta: "Xem →",
    onClick: () => navigate("/request/approval"),
  }));
  if (hoa && hoa.managerForm) {
    if (!hoa.cbDone) tasks.push({ eyebrow: "✅ MY TASK — C&B", title: "Trần Thị Hoa · Thủ tục C&B", meta: `LWD ${hoa.lwd}`, borderColor: "hsl(var(--blue-bright))", cta: "Xử lý →", onClick: () => navigate("/task/cb") });
    if (!hoa.itsDone) tasks.push({ eyebrow: "✅ MY TASK — ITS", title: "Trần Thị Hoa · Thu hồi tài sản", meta: "Cần xử lý trước LWD", borderColor: "hsl(var(--blue-bright))", cta: "Xử lý →", onClick: () => navigate("/task/its") });
    if (!hoa.adminDone) tasks.push({ eyebrow: "✅ MY TASK — Admin", title: "Trần Thị Hoa · Bàn giao hành chính", meta: "Cần xử lý trước LWD", borderColor: "hsl(var(--blue-bright))", cta: "Xử lý →", onClick: () => navigate("/task/admin") });
    tasks.push({ eyebrow: "👥 PPL/HR", title: "Trần Thị Hoa · 2 form đã có", meta: "Chờ đối chiếu", borderColor: "hsl(var(--purple))", cta: "Đối chiếu →", onClick: () => navigate(`/ppl/result?id=${hoa.id}`) });
  }

  return (
    <div className="space-y-6 max-w-[1200px]">
      {/* Hero */}
      <div className="rounded-2xl text-white p-7 bg-gradient-brand shadow-elevated">
        <div className="flex items-center gap-5">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-white/20 border-2 border-white/40 text-xl font-extrabold">NT</div>
          <div>
            <div className="text-2xl font-bold">{currentUser.name}</div>
            <div className="text-brand-soft text-sm mt-0.5">{currentUser.title} · {currentUser.department}</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-6 text-sm">
          <div className="flex items-center gap-2.5"><User className="h-4 w-4 text-brand-soft" /> <span>{currentUser.name}</span></div>
          <div className="flex items-center gap-2.5"><Phone className="h-4 w-4 text-brand-soft" /> <span>{currentUser.phone}</span></div>
          <div className="flex items-center gap-2.5"><Mail className="h-4 w-4 text-brand-soft" /> <span>{currentUser.email}</span></div>
          <div className="flex items-center gap-2.5"><IdCard className="h-4 w-4 text-brand-soft" /> <span>{currentUser.empId}</span></div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="tv-card p-5">
        <div className="grid grid-cols-4 gap-4 max-w-md">
          <QuickAction icon={Plus} label="Tạo yêu cầu mới" to="/request/my?new=1" />
          <QuickAction icon={FileCheck} label="Phê duyệt yêu cầu" badge={approvals.length} to="/request/approval" />
          <QuickAction icon={Info} label="Thông tin hỗ trợ" to="/profile" />
          <QuickAction icon={Wallet} label="Phiếu lương" to="/payslip" />
        </div>
      </div>

      {/* Tasks */}
      <div>
        <SectionHeader title="Cần xử lý hôm nay" count={tasks.length} />
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <div className="tv-card p-8 text-center text-muted-foreground">Không có việc cần xử lý 🎉</div>
          ) : tasks.map((t, i) => <TaskCard key={i} {...t} />)}
        </div>
      </div>

      {/* Văn bản & Chính sách */}
      <div>
        <SectionHeader title="Văn bản & Chính sách" link={{ label: "Xem thêm", onClick: () => {} }} />
        <div className="grid grid-cols-2 gap-4">
          {[
            { title: "Chính sách khuyến học 2026", date: "10/04/2026", excerpt: "Hỗ trợ học phí lên đến 50% cho khóa học công nghệ liên quan công việc.", tag: "CHÍNH SÁCH KHUYẾN HỌC" },
            { title: "Quy chế lương thưởng quý 2", date: "01/04/2026", excerpt: "Cập nhật cơ chế xét thưởng performance theo OKR cho quý 2/2026.", tag: "LƯƠNG THƯỞNG Q2" },
          ].map((c, i) => (
            <div key={i} className="tv-card overflow-hidden hover:shadow-elevated transition cursor-pointer">
              <div className="h-32 bg-gradient-brand grid place-items-center px-6">
                <div className="text-white font-extrabold text-center text-sm tracking-wider">{c.tag}</div>
              </div>
              <div className="p-4">
                <div className="font-bold text-sm">{c.title}</div>
                <div className="text-xs text-muted-foreground mt-1">{c.date}</div>
                <div className="text-[13px] text-foreground/80 mt-2 line-clamp-2">{c.excerpt}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
