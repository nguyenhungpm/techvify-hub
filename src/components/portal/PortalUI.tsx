import { ReactNode } from "react";

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <h1 className="text-[22px] font-extrabold text-foreground">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
}

export function SectionHeader({ title, link, count }: { title: string; link?: { label: string; onClick: () => void }; count?: number }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-base font-bold text-foreground flex items-center gap-2">
        {title}
        {count !== undefined && (
          <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-bright px-2 text-[11px] font-bold text-white">
            {count}
          </span>
        )}
      </h2>
      {link && (
        <button onClick={link.onClick} className="text-[13px] font-semibold text-brand-bright hover:underline">
          {link.label} ›
        </button>
      )}
    </div>
  );
}

export function StatusBadge({ status }: { status: "pending" | "approved" | "done" | "rejected" | "draft" | string }) {
  const map: Record<string, { cls: string; label: string }> = {
    pending: { cls: "status-pending", label: "Chờ duyệt" },
    approved: { cls: "status-approved", label: "Đã duyệt" },
    done: { cls: "status-done", label: "Hoàn thành" },
    completed: { cls: "status-done", label: "Hoàn thành" },
    rejected: { cls: "status-rejected", label: "Từ chối" },
    draft: { cls: "status-draft", label: "Nháp" },
    pending_manager: { cls: "status-pending", label: "Chờ Manager xử lý" },
    in_progress: { cls: "status-approved", label: "Đang xử lý" },
    active: { cls: "status-done", label: "Active" },
    pending_exit: { cls: "status-rejected", label: "Pending Exit" },
  };
  const info = map[status] ?? { cls: "status-draft", label: status };
  return (
    <span className={`${info.cls} inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold`}>
      {info.label}
    </span>
  );
}
