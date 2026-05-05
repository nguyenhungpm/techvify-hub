import { create } from "zustand";
import { persist } from "zustand/middleware";

export type RequestStatus = "pending" | "approved" | "rejected";
export type RequestType = "leave" | "ot" | "absence" | "resignation";

export interface PortalRequest {
  id: string;
  type: RequestType;
  typeLabel: string;
  submitter: string;        // empId
  submitterName: string;
  date: string;             // request date
  detail: string;           // free-form
  status: RequestStatus;
  createdAt: string;
  comment?: string;
}

export interface ExitFormData {
  // Step 1 — Thông tin
  noticeDate?: string;
  lwd?: string;
  // Step 2 — Lý do nghỉ (multi-cat chips)
  reasonsByCategory?: Record<string, string[]>;
  otherReason?: string;
  primaryCategory?: string;
  // Backward-compat
  primaryReason?: string;
  detailReasons?: string[];
  notes?: string;
  // Step 3 — Đánh giá
  satisfactionText?: string;     // Câu 5
  policyBlocker?: string;        // Câu 6
  nextJobAttraction?: string;    // Câu 7
  // Step 4 — Phản hồi
  improvementSuggestion?: string;        // Câu 8
  comebackChoice?: "never" | "maybe" | "yes"; // Câu 9
  referChoice?: "yes" | "maybe" | "no";       // Câu 10
  referName?: string;
  referPhone?: string;
  referPosition?: string;
  referEmail?: string;
  referNote?: string;
  // Legacy
  comeback?: "yes" | "maybe" | "no";
  refer?: "yes" | "no";
  newJob?: string;
  handoverPerson?: string;
  remainingLeave?: string;
  satisfaction?: number;
  improvement?: string;
  submittedAt?: string;
}

export interface ManagerFormData {
  // Step 1 — Thông tin nhân sự
  managerName?: string;
  managerTitle?: string;
  managerDept?: string;
  selectedEmpId?: string;
  empLevel?: string;
  noticeDate?: string;
  lwd?: string;
  // Step 2 — Phân loại
  exitType?: "VOL" | "INVOL" | "EOC";
  reasonClassification?: string;
  narrative?: string;
  // Step 3 — Impact
  critical?: "critical" | "normal" | "none";
  replacement?: "yes" | "transfer" | "no";
  replacementDeadline?: string;
  impactNote?: string;
  // Step 4
  confirmed?: boolean;
  // Legacy
  criticality?: "low" | "normal" | "high";
  needReplacement?: "yes" | "no";
  replacementBy?: string;
  knowledgeTransfer?: string[];
  riskNotes?: string;
  submittedAt?: string;
}

export interface OffboardingRequest {
  id: string;
  empId: string;
  empName: string;
  title: string;
  department: string;
  submittedAt: string;
  lwd: string;
  status: "pending_manager" | "in_progress" | "completed";
  exitForm?: ExitFormData;
  managerForm?: ManagerFormData;
  cb: boolean[];      // 7
  its: boolean[];     // 9
  admin: boolean[];   // 4
  pplNotes?: string;
  exitInterviewDate?: string;
  exitInterviewResult?: string;
  cbDone?: boolean;
  itsDone?: boolean;
  adminDone?: boolean;
  pplDone?: boolean;
}

interface State {
  requests: PortalRequest[];
  approvals: PortalRequest[];
  offboardings: OffboardingRequest[];
  notifications: number;
  addRequest: (r: PortalRequest) => void;
  updateApproval: (id: string, status: RequestStatus, comment?: string) => void;
  upsertOffboarding: (o: OffboardingRequest) => void;
  updateOffboarding: (id: string, patch: Partial<OffboardingRequest>) => void;
  toggleChecklist: (id: string, kind: "cb" | "its" | "admin", index: number) => void;
  completeChecklist: (id: string, kind: "cb" | "its" | "admin") => void;
}

const seedOffboardings: OffboardingRequest[] = [
  {
    id: "off-hoa",
    empId: "TVF-0217",
    empName: "Trần Thị Hoa",
    title: "QA Engineer",
    department: "D2",
    submittedAt: new Date(Date.now() - 3 * 86400_000).toISOString(),
    lwd: "2026-05-30",
    status: "pending_manager",
    exitForm: {
      lwd: "2026-05-30",
      noticeDate: new Date(Date.now() - 3 * 86400_000).toISOString().slice(0, 10),
      reasonsByCategory: {
        "💰 Lương & Đãi ngộ": ["Có offer mới cao hơn", "Mức lương sau review chưa thỏa đáng"],
      },
      primaryCategory: "💰 Lương & Đãi ngộ",
      primaryReason: "💰 Lương & Đãi ngộ",
      detailReasons: ["Có offer mới cao hơn", "Mức lương sau review chưa thỏa đáng"],
      nextJobAttraction: "Cơ hội phát triển kỹ năng và mức lương cạnh tranh hơn",
      comebackChoice: "maybe",
      comeback: "maybe",
      referChoice: "yes",
      refer: "yes",
      referName: "Nguyễn Văn B",
      referPhone: "0901234567",
      referPosition: "Senior Developer",
      handoverPerson: "Võ Văn Khoa",
      remainingLeave: "5 ngày",
      satisfaction: 4,
      improvementSuggestion: "Cải thiện chính sách review lương định kỳ",
      newJob: "QA Lead tại công ty fintech",
      notes: "Đã có offer chính thức từ tuần trước",
      submittedAt: new Date(Date.now() - 3 * 86400_000).toISOString(),
    },
    managerForm: undefined,
    cb: Array(8).fill(false),
    its: Array(9).fill(false),
    admin: Array(4).fill(false),
  },
  {
    id: "off-lan",
    empId: "TVF-0305",
    empName: "Phạm Thị Lan",
    title: "Business Analyst",
    department: "D2",
    submittedAt: new Date(Date.now() - 30 * 86400_000).toISOString(),
    lwd: "2026-04-10",
    status: "completed",
    exitForm: {
      primaryReason: "🏠 Lý do cá nhân",
      detailReasons: ["Chuyển nơi ở", "Lý do gia đình"],
      comeback: "yes",
      refer: "yes",
      lwd: "2026-04-10",
      submittedAt: new Date(Date.now() - 30 * 86400_000).toISOString(),
    },
    managerForm: {
      reasonClassification: "🏠 Lý do cá nhân",
      exitType: "VOL",
      narrative: "Chuyển về quê chăm gia đình",
      criticality: "low",
      needReplacement: "no",
      submittedAt: new Date(Date.now() - 28 * 86400_000).toISOString(),
    },
    cb: Array(8).fill(true),
    its: Array(9).fill(true),
    admin: Array(4).fill(true),
    cbDone: true,
    itsDone: true,
    adminDone: true,
    pplNotes: "Đã hoàn tất exit interview, mọi việc thuận lợi.",
    exitInterviewDate: "2026-04-05",
    exitInterviewResult: "Ra đi trên tinh thần tích cực",
  },
];

const seedApprovals: PortalRequest[] = [
  {
    id: "req-hoa-leave",
    type: "leave",
    typeLabel: "Nghỉ phép",
    submitter: "TVF-0217",
    submitterName: "Trần Thị Hoa",
    date: "2026-04-22",
    detail: "Nghỉ phép 2 ngày — việc gia đình",
    status: "pending",
    createdAt: new Date(Date.now() - 86400_000).toISOString(),
  },
  {
    id: "req-khoa-absence",
    type: "absence",
    typeLabel: "Vắng mặt tính công",
    submitter: "TVF-0388",
    submitterName: "Võ Văn Khoa",
    date: "2026-04-18",
    detail: "Đi công tác khách hàng — không chấm công",
    status: "pending",
    createdAt: new Date(Date.now() - 2 * 86400_000).toISOString(),
  },
];

const seedRequests: PortalRequest[] = [
  {
    id: "my-req-1",
    type: "leave",
    typeLabel: "Nghỉ phép",
    submitter: "TVF-0142",
    submitterName: "Nguyễn Minh Tuấn",
    date: "2026-04-10",
    detail: "Nghỉ phép 1 ngày",
    status: "approved",
    createdAt: new Date(Date.now() - 7 * 86400_000).toISOString(),
  },
  {
    id: "my-req-2",
    type: "ot",
    typeLabel: "Đăng ký OT",
    submitter: "TVF-0142",
    submitterName: "Nguyễn Minh Tuấn",
    date: "2026-04-15",
    detail: "OT 2 tiếng — release sprint",
    status: "pending",
    createdAt: new Date(Date.now() - 2 * 86400_000).toISOString(),
  },
];

export const usePortalStore = create<State>()(
  persist(
    (set) => ({
      requests: seedRequests,
      approvals: seedApprovals,
      offboardings: seedOffboardings,
      notifications: 2,
      addRequest: (r) => set((s) => ({ requests: [r, ...s.requests] })),
      updateApproval: (id, status, comment) =>
        set((s) => ({
          approvals: s.approvals.map((a) => (a.id === id ? { ...a, status, comment } : a)),
        })),
      upsertOffboarding: (o) =>
        set((s) => {
          const exists = s.offboardings.find((x) => x.id === o.id);
          return {
            offboardings: exists
              ? s.offboardings.map((x) => (x.id === o.id ? o : x))
              : [o, ...s.offboardings],
          };
        }),
      updateOffboarding: (id, patch) =>
        set((s) => ({
          offboardings: s.offboardings.map((o) => (o.id === id ? { ...o, ...patch } : o)),
        })),
      toggleChecklist: (id, kind, index) =>
        set((s) => ({
          offboardings: s.offboardings.map((o) => {
            if (o.id !== id) return o;
            const arr = [...o[kind]];
            arr[index] = !arr[index];
            return { ...o, [kind]: arr };
          }),
        })),
      completeChecklist: (id, kind) =>
        set((s) => ({
          offboardings: s.offboardings.map((o) => {
            if (o.id !== id) return o;
            const doneFlag = kind === "cb" ? "cbDone" : kind === "its" ? "itsDone" : "adminDone";
            return { ...o, [doneFlag]: true };
          }),
        })),
    }),
    { name: "techvify-portal-v3" }
  )
);

export const CB_ITEMS = [
  "Tính lương còn lại đến LWD",
  "Tính phép năm chưa sử dụng",
  "Xử lý BHXH — chốt sổ bảo hiểm",
  "Xử lý BHYT — trả thẻ bảo hiểm",
  "Quyết toán thuế TNCN",
  "Xác nhận ký hai bên (NV + đại diện công ty)",
  "Thanh lý hợp đồng lao động",
  "Chuyển khoản thanh toán cuối",
];

export const ITS_ITEMS = [
  "Thu hồi laptop / thiết bị công ty",
  "Thu hồi thẻ nhân viên (badge)",
  "Deactivate VPN",
  "Deactivate email công ty",
  "Deactivate tài khoản Slack",
  "Deactivate tài khoản THRM",
  "Deactivate tài khoản DES",
  "Deactivate các SaaS khác (Jira, Confluence, GitHub...)",
  "Backup & transfer dữ liệu cá nhân (nếu yêu cầu)",
];

export const ADMIN_ITEMS = [
  "Thu hồi thẻ ra vào / access card",
  "Bàn giao chỗ ngồi & tài sản văn phòng",
  "Xác nhận hoàn trả đồng phục (nếu có)",
  "Ký biên bản bàn giao hành chính",
];
