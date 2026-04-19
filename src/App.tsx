import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PortalLayout } from "@/components/layout/PortalLayout";
import Home from "./pages/Home";
import MyProfile from "./pages/MyProfile";
import MyDepartment from "./pages/MyDepartment";
import MyAttendance from "./pages/MyAttendance";
import EmpAttendance from "./pages/EmpAttendance";
import Payslip from "./pages/Payslip";
import MyRequest from "./pages/MyRequest";
import MyApproval from "./pages/MyApproval";
import ExitForm from "./pages/ExitForm";
import ManagerForm from "./pages/ManagerForm";
import TaskChecklist from "./pages/TaskChecklist";
import PplList from "./pages/PplList";
import PplResult from "./pages/PplResult";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<PortalLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<MyProfile />} />
            <Route path="/department" element={<MyDepartment />} />
            <Route path="/attendance/me" element={<MyAttendance />} />
            <Route path="/attendance/team" element={<EmpAttendance />} />
            <Route path="/payslip" element={<Payslip />} />
            <Route path="/request/my" element={<MyRequest />} />
            <Route path="/request/approval" element={<MyApproval />} />
            <Route path="/exit-form" element={<ExitForm />} />
            <Route path="/manager-form/:id" element={<ManagerForm />} />
            <Route path="/task/cb" element={<TaskChecklist kind="cb" />} />
            <Route path="/task/its" element={<TaskChecklist kind="its" />} />
            <Route path="/task/admin" element={<TaskChecklist kind="admin" />} />
            <Route path="/ppl/list" element={<PplList />} />
            <Route path="/ppl/result" element={<PplResult />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
