export const currentUser = {
  empId: "TVF-0142",
  name: "Nguyễn Minh Tuấn",
  title: "Senior Developer",
  department: "D2",
  email: "minh.tuan@techvify.com.vn",
  phone: "0912 345 678",
  joinDate: "2022-03-15",
  contract: "Chính thức",
  managerName: "Nguyễn Minh Huy",
  managerEmpId: "TVF-0089",
};

export const teamD2 = [
  { empId: "TVF-0142", name: "Nguyễn Minh Tuấn", title: "Senior Developer", contract: "Chính thức", joinDate: "2022-03-15", status: "active" as const, des: "Acme Corp — Order Management Revamp", billable: 100 },
  { empId: "TVF-0217", name: "Trần Thị Hoa", title: "QA Engineer", contract: "Chính thức", joinDate: "2023-01-10", status: "pending_exit" as const, des: "GlobalBank — QA Automation Suite", billable: 80 },
  { empId: "TVF-0305", name: "Phạm Thị Lan", title: "Business Analyst", contract: "Thử việc", joinDate: "2025-09-01", status: "active" as const, des: "Bench — Internal Rotation", billable: 0 },
  { empId: "TVF-0388", name: "Võ Văn Khoa", title: "Middle Developer", contract: "Chính thức", joinDate: "2023-06-20", status: "active" as const, des: "HealthCo — Patient Portal", billable: 100 },
  { empId: "TVF-0401", name: "Đặng Quốc Bảo", title: "Junior Developer", contract: "Chính thức", joinDate: "2024-02-01", status: "active" as const, des: "Acme Corp — Order Management Revamp", billable: 100 },
];

export const myTimesheet = [
  { day: "T2 14/04", shift: "HC_1C", inOut: "08:58 → 18:02", total: "8g4p", status: "Đủ công" },
  { day: "T3 15/04", shift: "HC_1C", inOut: "09:11 → 17:28", total: "7g30p", status: "Đủ công" },
  { day: "T4 16/04", shift: "HC_1C", inOut: "08:43 → 18:04", total: "7g30p", status: "Đủ công" },
  { day: "T5 17/04", shift: "HC_1C", inOut: "08:52 → 16:59", total: "7g30p", status: "Đủ công" },
  { day: "T6 18/04", shift: "HC_1C", inOut: "08:58→10:02 · 10:03→11:49 · 11:51→12:50 · 14:57→--", total: "3g4p", status: "Thiếu công" },
];

export const teamTimesheet = [
  { empId: "TVF-0142", name: "Nguyễn Minh Tuấn", days: ["✓","✓","✓","✓","✓"] },
  { empId: "TVF-0217", name: "Trần Thị Hoa", days: ["✓","✓","✓","⚠️ 6g","✓"] },
  { empId: "TVF-0305", name: "Phạm Thị Lan", days: ["✓","✓","✓","✓","✓"] },
  { empId: "TVF-0388", name: "Võ Văn Khoa", days: ["✓","✓","✓","✓","✓"] },
  { empId: "TVF-0401", name: "Đặng Quốc Bảo", days: ["✓","✓","✓","✓","—"] },
];

export const payslip = {
  period: "Tháng 04/2026",
  income: [
    { label: "Lương cơ bản", value: 30_000_000 },
    { label: "Phụ cấp", value: 2_500_000 },
    { label: "Thưởng", value: 3_000_000 },
  ],
  totalIncome: 35_500_000,
  deductions: [
    { label: "BHXH 8%", value: 2_400_000 },
    { label: "BHYT 1.5%", value: 450_000 },
    { label: "BHTN 1%", value: 300_000 },
    { label: "Thuế TNCN", value: 1_825_000 },
  ],
  totalDeductions: 4_975_000,
  netPay: 30_525_000,
};

export const formatVND = (n: number) => n.toLocaleString("vi-VN") + " ₫";
